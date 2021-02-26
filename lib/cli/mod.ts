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
    readonly defaultCommand: Commander
}

class DefaultCommandLineOptions {
    readonly defaultCommand: Commander = new UnknownCommand()
}

export class CommandLine {
    private command: Map<string, Commander>
    private readonly defaultCommand: Commander
    
    constructor(options: CommandLineOptions = new DefaultCommandLineOptions()) {
        this.defaultCommand = options.defaultCommand
        this.command = new Map()
    }

    addCommand(command: Commander): void {
        this.command.set(command.name, command)
    }

    run(args: string[]) {
        const nameCommand = args.shift() || this.defaultCommand.name
        const commandArgs = args
        const currentCommand = this.command.get(nameCommand) || this.defaultCommand

        currentCommand.execute(commandArgs)
    }
}
