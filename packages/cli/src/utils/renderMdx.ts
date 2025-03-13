import fs from 'fs-extra'
import path from 'path'

import { renderToString } from 'react-dom/server'
import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import { evaluate } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'

export async function renderMdxToHtml(inputDir: string, outputDir: string, components: any) {
  const files = await fs.readdir(inputDir)

  for (const file of files) {
    if (!file.endsWith('.mdx')) continue

    const inputPath = path.join(inputDir, file)
    const outputPath = path.join(outputDir, file.replace('.mdx', '.html'))

    try {
      // Read MDX content
      const mdxContent = await fs.readFile(inputPath, 'utf-8')
      console.log('mdxContent', mdxContent)

      // Evaluate MDX content
      const { default: Content } = await evaluate(mdxContent, {
        ...React,
        jsx: runtime.jsx,
        jsxs: runtime.jsxs,
        Fragment: runtime.Fragment,
        useMDXComponents: () => components,
      })
      console.log('Content', Content)

      // Render with MDXProvider
      const html = renderToString(
        React.createElement(MDXProvider, { components }, React.createElement(Content))
      )

      // Write HTML output
      await fs.outputFile(
        outputPath,
        `
        <!DOCTYPE html>
        <html>
          <body>
            ${html}
          </body>
        </html>
      `
      )
      console.log(`Rendered: ${file} -> ${outputPath}`)
    } catch (error) {
      console.error(`Error processing ${file}:`, error)
    }
  }
}
