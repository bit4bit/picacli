import { Actioner, ActionName, ActionRoot } from './mod.ts'
import { Stater } from '../state/mod.ts'
import { PicacliAction } from '../mod.ts'
import { ClockifyClock } from './clock_manager/clockify_clock.ts'

// TODO la accion de terminar el reloj
// esta dependiente de clockify-clock, abstraer
// una posibilidad es declara un ClockInClockify
// que se ejecute en cadena desde clock
export class ClockOut implements Actioner {

    name(): ActionName {
        return 'clock-out'
    }

    when(): PicacliAction {
        return PicacliAction.ClockOut
    }

    runAfter(): ActionName {
        return ActionRoot
    }

    async tcpBegin(state: Stater) {
        if (!state.has('clockify.clock_id')) {
            throw new Error('required clockify.clock_id')
        }
    }

    async commit(state: Stater, configurationState: Stater) {
        if (!state.has('clockify.workspace_id'))
            throw new Error('first run clock-in')

        // TODO depende indirectamente de clock-in
        const apiKey = state.get('clockify.api_key') + ''
        const workspaceId = state.get('clockify.workspace_id') + ''
        const clockId = state.get('clockify.clock_id') + ''

        const clockManager = new ClockifyClock()
        clockManager.apiKey = apiKey
        clockManager.workspaceId = workspaceId

        
        await clockManager.out(clockId)
    }

    async tcpVote() {
    }

    async tcpAbort() {
    }

    async tcpFinish() {
        console.log('!! clockify clock stop')
    }
}
