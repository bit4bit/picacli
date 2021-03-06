import {Commander} from '../cli/mod.ts'
import Picacli from '../main.ts'

export default class ClockInCommand implements Commander {
    readonly name: string = 'clock-in'
    readonly description: string = `
start clock
`

    execute(args: string[]) {
        Picacli.clockIn()
    }
}
