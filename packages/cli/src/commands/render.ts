import { Command } from 'commander'
import { renderMdxToHtml } from '../utils/renderMdx'
import path from 'path'
import { loadConfig } from '../utils/loadConfig'
import fs from 'fs-extra'

export const renderCommand = new Command('render')
  .description('Render MDX files to HTML')
  .option('-i, --input <path>', 'Input directory containing MDX files')
  .option('-o, --output <path>', 'Output directory for rendered HTML files')
  .action(async (options) => {
    const { input, output } = options
    // Load user-defined config
    const { config, configPath } = await loadConfig()

    if (!configPath) {
      throw new Error('No hubql.config.ts found')
    }

    // Extract custom components (if any)
    const components = config.components || {}

    // Resolve input/output directories
    const configDir = path.dirname(configPath)

    const inputPath = input
      ? path.resolve(process.cwd(), input)
      : path.join(configDir, 'docs', 'mdx')
    const outputPath = output
      ? path.resolve(process.cwd(), output)
      : path.join(configDir, 'docs', 'html')

    // Create directories if they don't exist
    await fs.ensureDir(inputPath)
    await fs.ensureDir(outputPath)

    // Render MDX files to HTML
    await renderMdxToHtml(inputPath, outputPath, components)
    console.log(`MDX files rendered to HTML in ${output}`)
  })
