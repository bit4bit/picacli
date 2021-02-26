import {CommandLine} from "./cli/mod.ts"
import HelpCommand from "./command/help.ts"

export default function(args: string[]) {
    let default_command = new HelpCommand()
    let cli = new CommandLine({default_command: default_command})

    cli.run([...args])
}
