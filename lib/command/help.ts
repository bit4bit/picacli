import {Commander} from "../cli/mod.ts"

export default class HelpCommand implements Commander {
    readonly name: string = "help"
    readonly description: string = `
Usage: picacli <action> <arguments>
`
    execute(args: string[]) {
        console.log(this.description)
        Deno.exit(-1)
    }
}
