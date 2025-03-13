import { Command } from 'commander'
import { generateMarkdownFiles } from '../utils/generateMarkdown'
import path from 'path'
import chalk from 'chalk'


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

      generateMarkdownFiles({
        contentPath,
        specPath,
        output
      })

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(chalk.red('❌ Error generating MDX:'), error.message)
      } else {
        console.error(chalk.red('❌ Error generating MDX:'), String(error))
      }
      process.exit(1)
    }
  })
