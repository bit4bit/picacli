import {CommandLine} from './cli/mod.ts'
import HelpCommand from './command/help.ts'
import OpenCommand from './command/open.ts'

export default function(args: string[]) {
    const defaultCommand = new HelpCommand()
    const cli = new CommandLine({defaultCommand: defaultCommand})
    cli.addCommand(new OpenCommand())

    cli.run([...args])
}
