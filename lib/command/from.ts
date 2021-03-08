import {Commander} from '../cli/mod.ts'
import Picacli from '../main.ts'

/**
 * OpenCommand.
 * Abre el directorio para ser gestionado como proyecto,
 * esto basicamente es mantener el estado del proyecto actual.
 */
export default class FromCommand implements Commander {
    readonly name: string = 'from'
    readonly description: string = `
Open issue from id
`

    execute(args: string[]) {
        if (args.length != 1)
            throw new Error('expected id')
        
        const id = args[0]

        Picacli.open_from(id)
    }
}
