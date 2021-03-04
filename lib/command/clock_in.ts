import {Commander} from '../cli/mod.ts'
import Picacli from '../main.ts'

/**
 * OpenCommand.
 * Abre el directorio para ser gestionado como proyecto,
 * esto basicamente es mantener el estado del proyecto actual.
 */
export default class ClockInCommand implements Commander {
    readonly name: string = 'clock-in'
    readonly description: string = `
start clock
`

    execute(args: string[]) {
        Picacli.clockIn()
    }
}
