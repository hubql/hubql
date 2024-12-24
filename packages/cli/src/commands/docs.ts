import { execSync } from 'child_process'
import path from 'path'
import fs from 'fs-extra'
import { Command } from 'commander'

export const docsCommand = new Command('docs').description('Manage documentation')

docsCommand
  .command('init')
  .description('Initialize documentation project')
  .action(async () => {
    await docsHandler({ init: true, serve: false, build: false })
  })

docsCommand
  .command('serve')
  .description('Serve documentation locally')
  .action(async () => {
    await docsHandler({ init: false, serve: true, build: false })
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
}: {
  init: boolean
  serve: boolean
  build: boolean
}) {
  const projectRoot = process.cwd()
  const hubqlDir = path.join(projectRoot, 'hubql')
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
    const contentDir = path.join(hubqlDir, 'content')
    fs.ensureDirSync(contentDir)
    fs.writeFileSync(
      path.join(contentDir, 'getting-started-2.mdx'),
      `
---
title: "Getting Started 2"
---
# Getting Started 2
Welcome to the documentation!
    `
    )

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
    execSync('npx astro dev', {
      cwd: hubqlDir,
      stdio: 'inherit',
    })
    return
  }

  // Build the Astro project
  if (build) {
    console.log('Building static documentation...')
    execSync('npx astro build', { cwd: hubqlDir, stdio: 'inherit' })
    return
  }

  console.error('Please specify a command: --init, --serve, or --build')
}
