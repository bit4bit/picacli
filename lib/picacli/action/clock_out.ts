import { Actioner, ActionName, ActionRoot } from './mod.ts'
import { Stater } from '../state/mod.ts'
import { PicacliAction } from '../mod.ts'

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

    async tcpBegin() {
    }

    async commit() {
    }

    async tcpVote() {
    }

    async tcpAbort() {
    }

    async tcpFinish() {
    }
}
