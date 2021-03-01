import { Stater } from '../state/mod.ts'

export interface Actioner {
    execute(state: Stater): Promise<void>
}
