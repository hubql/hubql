import { Command } from 'commander'
import { generateCommand } from './commands/generate'
import { renderCommand } from './commands/render'
import { docsCommand } from './commands/docs'

const program = new Command()

program.name('hubql').description('Hubql CLI').version('0.1.0')

program.addCommand(generateCommand)
// program.addCommand(renderCommand)
program.addCommand(docsCommand)

program.parse(process.argv)
