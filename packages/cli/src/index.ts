import { Command } from 'commander'
import { generateCommand } from './commands/generate'

const program = new Command()

program.name('hubql').description('Hubql CLI').version('0.1.0')

program.addCommand(generateCommand)

program.parse(process.argv)
