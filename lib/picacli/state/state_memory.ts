import { Stater } from './mod.ts'

export class StateMemory implements Stater {
    private data: Map<string, string | number> = new Map()

    set(key: string, val: string | number) {
        this.data.set(key, val)
    }

    get(key: string) {
        return this.data.get(key)
    }

    async commit(): Promise<void> {
    }

    async rollback(): Promise<void> {
    }

}
