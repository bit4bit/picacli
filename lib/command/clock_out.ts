import {Commander} from '../cli/mod.ts'
import Picacli from '../main.ts'

export default class ClockOutCommand implements Commander {
    readonly name: string = 'clock-out'
    readonly description: string = `
stop clock
`

    execute(args: string[]) {
        Picacli.clockOut()
    }
}
