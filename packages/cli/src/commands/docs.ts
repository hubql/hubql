import { execSync } from 'child_process'
import path from 'path'
import fs from 'fs-extra'
import { Command } from 'commander'
import { loadConfig } from '../utils/loadConfig'

export const docsCommand = new Command('docs').description('Manage documentation')

docsCommand
  .command('init')
  .description('Initialize documentation project')
  .action(async () => {
    await docsHandler({ init: true, serve: false, build: false })
  })

docsCommand
  .command('serve')
  .alias('s')
  .alias('dev')
  .description('Serve documentation locally')
  .option('-w, --workspaceId <id>', 'Workspace ID to serve documentation for')
  .action(async (options) => {
    await docsHandler({ init: false, serve: true, build: false, workspaceId: options.workspaceId })
  })

docsCommand
  .command('build')
  .description('Build static documentation')
  .action(async () => {
    await docsHandler({ init: false, serve: false, build: true })
  })

async function docsHandler({
  init = false,
  serve = false,
  build = false,
  workspaceId,
}: {
  init: boolean
  serve: boolean
  build: boolean
  workspaceId?: string
}) {
  const projectRoot = path.join(process.cwd(), '.hubql')
  const { config, configPath } = await loadConfig()

  // Find workspace
  const workspace = workspaceId
    ? config.workspaces.find((w: any) => w.id === workspaceId)
    : config.workspaces[0]


  if (!workspace) {
    console.error(`Workspace ${workspaceId} not found`)
    return
  }
  const astroConfigPath = path.join(projectRoot, 'astro.config.mjs')
  const tailwindConfigPath = path.join(projectRoot, 'tailwind.config.mjs')

  const pagesPath = path.join(projectRoot, 'src', 'pages')

  const checkIfInit = () => {
    try {
      fs.statSync(astroConfigPath)
      fs.statSync(tailwindConfigPath)
      fs.statSync(pagesPath)
      return true
    } catch (error) {
      return false
    }
  }

  const initialize = () => {
    console.log('Initializing Astro project...')
    fs.ensureDirSync(pagesPath)

    fs.writeFileSync(
      tailwindConfigPath,
      `
import { default as sharedConfig } from '@hubql/ui/tailwind.config'

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  ...sharedConfig,
}
    `
    )
    fs.writeFileSync(
      astroConfigPath,
      `
import { defineConfig } from 'astro/config'
import hubql from '@hubql/astro'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'

export default defineConfig({
  integrations: [react(), tailwind(), hubql()],
})
    `
    )

    // Generate default structure
    //     const contentDir = path.join(hubqlDir, 'content')
    //     fs.ensureDirSync(contentDir)
    //     fs.writeFileSync(
    //       path.join(contentDir, 'getting-started-2.mdx'),
    //       `
    // ---
    // title: "Getting Started 2"
    // ---
    // # Getting Started 2
    // Welcome to the documentation!
    //     `
    //     )

    console.log('Astro project initialized at ./hubql')
  }

  // Initialize Astro project
  if (init) {
    initialize()
    return
  }

  if (!checkIfInit()) {
    // console.error('Please run "hubql docs init" first')
    initialize()
  }

  // Serve the Astro project
  if (serve) {
    console.log('Starting Astro development server...')
    console.log(`Serving documentation for workspace: ${workspace.name} from ${projectRoot}`)

    // Create package.json manually first
    const packageJsonPath = path.join(projectRoot, 'package.json')
    if (!fs.existsSync(packageJsonPath)) {
      fs.writeFileSync(
        packageJsonPath,
        JSON.stringify(
          {
            name: 'hubql-docs',
            private: true,
            type: 'module',
            version: '0.0.0',
            "devDependencies": {
              "@hubql/typescript-config": "workspace:*"
            },
            "dependencies": {
              "@astrojs/react": "4.1.2",
              "@astrojs/tailwind": "5.1.4",
              "tailwindcss": "3.4.17",
              "@hubql/astro": "workspace:*",
              "@hubql/config": "workspace:*",
              "@hubql/ui": "workspace:*",
              "@types/react": "^19.0.2",
              "@types/react-dom": "^19.0.2",
              "astro": "5.1.1",
              "hubql": "workspace:*",
              "react": "19.0.0",
              "react-dom": "19.0.0"
            }
          },
          null,
          2
        )
      )
    }

    // Install dependencies
    execSync(`pnpm i astro@latest`, {
      cwd: projectRoot,
      stdio: 'inherit',
    })

    // Then run the dev server
    execSync(`HUBQL_WORKSPACE_ID=${workspace.id} npx astro dev`, {
      cwd: projectRoot,
      stdio: 'inherit',
    })
    return
  }

  // Build the Astro project
  if (build) {
    console.log('Building static documentation...')
    execSync('npx astro build', { cwd: projectRoot, stdio: 'inherit' })
    return
  }

  console.error('Please specify a command: --init, --serve, or --build')
}
