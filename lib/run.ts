import {CommandLine} from './cli/mod.ts'
import HelpCommand from './command/help.ts'
import OpenCommand from './command/open.ts'
import FromCommand from './command/from.ts'
import ClockInCommand from './command/clock_in.ts'
import ClockOutCommand from './command/clock_out.ts'

export default function(args: string[]) {
    const defaultCommand = new HelpCommand()
    const cli = new CommandLine({defaultCommand: defaultCommand})
    cli.addCommand(new OpenCommand())
    cli.addCommand(new ClockInCommand())
    cli.addCommand(new ClockOutCommand())
    cli.addCommand(new FromCommand())

    cli.run([...args])
}
