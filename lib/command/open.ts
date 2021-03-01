import {Commander} from '../cli/mod.ts'
import Picacli from '../main.ts'

/**
 * OpenCommand.
 * Abre el directorio para ser gestionado como proyecto,
 * esto basicamente es mantener el estado del proyecto actual.
 */
export default class OpenCommand implements Commander {
    readonly name: string = 'open'
    readonly description: string = `
Open a directory must contains .git
`

    execute(args: string[]) {
        if (args.length != 1)
            throw new Error('expected summary')
        
        const summary = args[0]

        Picacli.open(summary)
    }
}
