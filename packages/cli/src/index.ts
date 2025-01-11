import { Command } from 'commander'
// import { generateCommand } from './commands/generate'
// import { renderCommand } from './commands/render'
import { docsCommand } from './commands/docs'
import { startCommand } from './commands/start'
const program = new Command()

program.name('hubql').description('Hubql CLI').version('0.0.1')

// program.addCommand(generateCommand)
// program.addCommand(renderCommand)
program.addCommand(docsCommand)
program.addCommand(startCommand)

program.parse(process.argv)
