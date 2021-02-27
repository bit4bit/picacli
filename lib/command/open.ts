import {Commander} from '../cli/mod.ts'
import {Picacli} from '../picacli/mod.ts'

/**
 * OpenCommand.
 * Abre el directorio para ser gestionado como proyecto,
 * esto basicamente es mantener el estado del proyecto actual.
 */
export default OpenCommand implements Commander {
    readonly name: string = 'open'
    readonly description: string = `
Open a directory must contains .git
`

    execute(args: string[]) {
        let directory = Deno.cwd()
        if (args.length > 0)
            directory = args[0]

        Picacli.open(directory)
    }
}
