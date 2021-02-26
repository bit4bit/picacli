export interface Commander {
    readonly name: string
    readonly description: string
    execute(args: string[]): void
}

class UnknownCommand implements Commander {
    readonly name: string = "unknown-command"
    readonly description: string = "unknown command"
    execute(args: string[]) {
        throw new Error(`unknown command {this.name}`)
    }
}

// se pueden usar las interfaces
// para crear tipos para data
interface CommandLineOptions {
    readonly default_command: Commander
}

class DefaultCommandLineOptions {
    readonly default_command: Commander = new UnknownCommand()
}

export class CommandLine {
    private command: Map<string, Commander>
    private readonly default_command: Commander
    
    constructor(options: CommandLineOptions = new DefaultCommandLineOptions()) {
        this.default_command = options.default_command
        this.command = new Map()
    }

    addCommand(command: Commander): void {
        this.command.set(command.name, command)
    }

    run(args: string[]) {
        let name_command = args.shift() || this.default_command.name
        let command_args = args
        let current_command = this.command.get(name_command) || this.default_command

        current_command.execute(command_args)
    }
}
