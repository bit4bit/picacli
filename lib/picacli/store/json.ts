import { Storer } from './mod.ts'

class JsonStore implements Storer {
    set(section: string, key: string, val: string) {
    }

    get(section: string, key: string): string | undefined {
        return ''
    }

    commit(): void {
    }
}

export default new JsonStore()
