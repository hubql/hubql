import mdx from '@astrojs/mdx'
import matter from 'gray-matter'
import fs from 'fs'
import path from 'path'

export default function hubqlIntegration() {
  return {
    name: '@hubql/astro',
    hooks: {
      'astro:config:setup': ({ config, injectRoute, updateConfig }) => {
        // if (!options.contentDir) {
        //   throw new Error('Missing required contentDir')
        // }
        const integrations = [mdx()]
        updateConfig({
          integrations: integrations,
          vite: {
            optimizeDeps: {
              exclude: ['@hubql/ui'],
            },
          },
        })
        injectRoute({
          pattern: '/',
          // prerender: false,
          entrypoint: '@hubql/astro/index.astro',
          data: {},
        })
        const contentDir = './hubql/content'
        const docs = fs.readdirSync(path.resolve(process.cwd(), contentDir))
        for (const doc of docs) {
          if (!doc.endsWith('.mdx')) continue
          const filePath = path.resolve(contentDir, doc)
          const fileName = path.basename(filePath, '.mdx')
          const fileContent = fs.readFileSync(filePath, 'utf8')
          const { data, content } = matter(fileContent)
          injectRoute({
            pattern: `[...slug]`,
            entrypoint: '@hubql/astro/slug.astro',
            prerender: false,
            data: {
              ...data,
              content,
            },
          })
        }
      },
    },
  }
}
