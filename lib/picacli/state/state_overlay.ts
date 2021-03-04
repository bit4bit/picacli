import { Stater, StateKey, StateValue } from './mod.ts'

export class StateOverlay implements Stater {
    private states: Stater[]
    private writeState: Stater

    constructor(writeState: Stater, states: Stater[]) {
        this.writeState = writeState
        this.states = states
    }

    set(key: StateKey, value: StateValue): void {
        return this.writeState.set(key, value)
    }

    get(key: StateKey): StateValue {
        for(const state of this.states) {
            const val = state.get(key)
            if (val !== undefined) {
                return val
            }
        }
        return this.writeState.get(key)
    }

    async commit() {
        await this.writeState.commit()
    }

    async rollback() {
        await this.writeState.commit()
    }
}
