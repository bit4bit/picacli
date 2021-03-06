
import { Stater } from './mod.ts'

export class StateJson {
    private state: any = {}
    private path: string
    
    constructor(path: string) {
        this.path = path

        try {
            const data = Deno.readTextFileSync(this.path).trim()
            
            this.state = JSON.parse(data)
        } catch (e) {
            if (e instanceof Deno.errors.NotFound) {
                Deno.writeTextFileSync(this.path, '{}')
            } else {
                throw e
            }
        }
    }

    set(key: string, value: string | number): void {
        this.state[key] = value
    }

    get(key: string): string {
        const value = this.state[key]
        if (!value)
            return ''
        return value
    }

    has(key: string): boolean {
        const value = this.state[key]
        if (!value)
            return false
        return true
    }
    
    async commit() {
        const data = JSON.stringify(this.state)
        await Deno.writeTextFile(this.path, data)
    }

    async rollback() {
    }
}
