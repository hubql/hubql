import { parseOpenApiSpec, generateMDX } from '@hubql/core'
import matter from 'gray-matter'

import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'


export const generateMarkdownFiles = async ({
    contentPath,
    specPath,
    output
}: {
    contentPath: string
    specPath: string
    output: string
}) => {
    const ir = await parseOpenApiSpec(specPath)

    const mdxFiles = await fs.readdir(contentPath)
    const customContent = {}

    for (const file of mdxFiles) {
        if (!file.endsWith('.mdx')) continue
        const filePath = path.resolve(contentPath, file)
        const fileContent = await fs.readFile(filePath, 'utf8')
        const { data, content } = matter(fileContent)

        if (data.operationId) {
            ; (customContent as Record<string, string>)[data.operationId] = content
        }
    }

    // Iterate through paths and methods
    for (const [apiPath, pathItem] of Object.entries(ir.paths)) {
        for (const [method, operation] of Object.entries(pathItem)) {
            const mdxContent = generateMDX(operation)
            // Use operationId if available, otherwise use path-method
            const fileId =
                operation.operationId || `${apiPath.replace(/\//g, '-').replace(/^-/, '')}-${method}`

            let finalMdxContent = mdxContent

            if (operation.operationId && operation.operationId in customContent) {
                finalMdxContent += `\n\n<!-- Custom content from /content -->\n${customContent[operation.operationId as keyof typeof customContent]}`
            }

            const outputPath = path.resolve(output, `${fileId}.mdx`)
            await fs.ensureDir(path.dirname(outputPath))
            await fs.writeFile(outputPath, finalMdxContent)
            console.log(chalk.green(`✅ Generated ${outputPath}`))
        }
    }
}
