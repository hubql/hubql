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

        const contentDir = '../../docs/content'
        const contentPath = path.resolve(process.cwd(), contentDir)
        const docs = fs.readdirSync(contentPath)
        const menu = []
        const docPages = []
        for (const doc of docs) {
          // if (!doc.endsWith('.mdx')) continue
          if (doc.endsWith('.mdx')) {
            const filePath = path.resolve(contentDir, doc)
            const fileName = path.basename(filePath, '.mdx')
            const fileContent = fs.readFileSync(filePath, 'utf8')
            console.log('fileName', fileName)
            const { data: frontmatter, content } = matter(fileContent)

            docPages.push({
              slug: fileName,
              frontmatter,
              content,
            })
          } else {
            const subDocs = fs.readdirSync(path.resolve(contentDir, doc))
            for (const subDoc of subDocs) {
              const subDocPath = path.resolve(contentDir, doc, subDoc)
              console.log('subDocPath', subDocPath)

              const subDocContent = fs.readFileSync(subDocPath, 'utf8')
              const { data: frontmatter, content } = matter(subDocContent)
              docPages.push({
                slug: subDoc,
                frontmatter,
                content,
              })
            }
          }
        }

        for (const doc of docPages) {
          const compiledMDX = await compile(doc.content, { outputFormat: 'function-body' })
          menu.push({
            category: doc.frontmatter.title,
            categoryUrl: doc.slug,
            items: [
              // { title: 'Overview', filename: 'overview' }
            ],
          })
          injectRoute({
            pattern: `/${doc.slug}`,
            entrypoint: '@hubql/astro/slug.astro',
            prerender: false,
            data: {
              frontmatter: doc.frontmatter,
              content: doc.content,
            },
          })
        }
        const indexFile = path.basename(contentPath, 'page.mdx')
        const indexFileContent = fs.readFileSync(indexFile, 'utf8')
        const { data: frontmatter, content } = matter(indexFileContent)

        injectRoute({
          pattern: '/',
          // prerender: false,
          entrypoint: '@hubql/astro/index.astro',
          data: {
            content,
            menu,
          },
        })
      },
    },
  }
}
