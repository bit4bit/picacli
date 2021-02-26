import {CommandLine} from "./mod.ts"

export default function(args: string[]) {
    let cli = new CommandLine()
    cli.run([...args])
}
