
import { Stater } from './mod.ts'

export class JsonState {
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

    get(key: string): string | undefined {
        return this.state[key]
    }

    async commit() {
        const data = JSON.stringify(this.state)
        await Deno.writeTextFile(this.path, data)
    }

    async rollback() {
    }
}
