import { Command } from 'commander'
import { parseOpenApiSpec, generateMDX } from '@hubql/core'
import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import matter from 'gray-matter'

export const generateCommand = new Command('generate')
  .description('Generate MDX from an OpenAPI spec')
  .option('-i, --input <path>', 'Path to the OpenAPI file (YAML or JSON)', 'openapi.yml')
  .option('-o, --output <path>', 'Output directory for the generated MDX files', './dist')
  .option('-c, --content <path>', 'Path to the folder containing custom MDX content', './content')
  .action(async (options) => {
    const { input, output, content } = options

    try {
      const specPath = path.resolve(input)
      const contentPath = path.resolve(content)

      const ir = await parseOpenApiSpec(specPath)

      const mdxFiles = await fs.readdir(contentPath)
      const customContent = {}

      for (const file of mdxFiles) {
        if (!file.endsWith('.mdx')) continue
        const filePath = path.resolve(contentPath, file)
        const fileContent = await fs.readFile(filePath, 'utf8')
        const { data, content } = matter(fileContent)

        if (data.operationId) {
          ;(customContent as Record<string, string>)[data.operationId] = content
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(chalk.red('❌ Error generating MDX:'), error.message)
      } else {
        console.error(chalk.red('❌ Error generating MDX:'), String(error))
      }
      process.exit(1)
    }
  })
