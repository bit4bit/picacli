import { Stater, StateKey, StateValue } from './mod.ts'

export class StateMemory implements Stater {
    private data: Map<string, string | number> = new Map()

    set(key: StateKey, val: StateValue) {
        this.data.set(key, val)
    }

    get(key: StateKey): StateValue {
        const value = this.data.get(key)
        if (value === undefined)
            return ''
        return value
    }

    async commit(): Promise<void> {
    }

    async rollback(): Promise<void> {
    }

}
