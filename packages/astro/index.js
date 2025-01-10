import mdx from '@astrojs/mdx'
import matter from 'gray-matter'
import fs from 'fs'
import path from 'path'
import { compile } from '@mdx-js/mdx'

export default function hubqlIntegration() {
  return {
    name: '@hubql/astro',
    hooks: {
      'astro:config:setup': async ({ config, injectRoute, updateConfig }) => {
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
        console.log('docs', docs)
        for (const doc of docs) {
          console.log('doc', doc)
          if (!doc.endsWith('.mdx')) continue
          const filePath = path.resolve(contentDir, doc)
          const fileName = path.basename(filePath, '.mdx')
          const fileContent = fs.readFileSync(filePath, 'utf8')
          const { data: frontmatter, content } = matter(fileContent)
          const compiledMDX = await compile(content, { outputFormat: 'function-body' })

          console.log(frontmatter)
          console.log(content)
          injectRoute({
            pattern: `[...slug]`,
            entrypoint: '@hubql/astro/slug.astro',
            prerender: false,
            data: {
              frontmatter,
              content: String(compiledMDX),
            },
          })
        }
      },
    },
  }
}
