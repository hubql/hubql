import mdx from '@astrojs/mdx'
import matter from 'gray-matter'
import react from '@astrojs/react'

import fs from 'fs'
import path from 'path'

export default function hubqlIntegration() {
  return {
    name: 'hubql-astro',
    hooks: {
      'astro:config:setup': ({ injectRoute, updateConfig }) => {
        // if (!options.contentDir) {
        //   throw new Error('Missing required contentDir')
        // }
        updateConfig({
          integrations: [
            // Enable React for the build
            react(),
            mdx(),
          ],
          vite: {
            resolve: {
              alias: {
                '@hubql/ui': path.resolve(process.cwd(), 'node_modules/@hubql/ui'),
              },
            },
          },
        })
        const contentDir = './hubql/content'
        const docs = fs.readdirSync(path.resolve(process.cwd(), contentDir))
        for (const doc of docs) {
          if (!doc.endsWith('.mdx')) continue
          const filePath = path.resolve(contentDir, doc)
          const fileName = path.basename(filePath, '.mdx')
          const fileContent = fs.readFileSync(filePath, 'utf8')
          const { data, content } = matter(fileContent)

          //   injectRoute({
          //     pattern: `/${data.operationId || fileName}`,
          //     entrypoint: '@hubql/astro/test.astro',
          //     data: {
          //       ...data,
          //       content,
          //     },
          //   })
        }
      },
    },
  }
}
