import { Actioner, ActionName, ActionRoot } from './mod.ts'
import { Stater } from '../state/mod.ts'
import { PicacliAction } from '../mod.ts'

export class ClockIn implements Actioner {
    name(): ActionName {
        return 'clock-in'
    }

    when(): PicacliAction {
        return PicacliAction.ClockIn
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
