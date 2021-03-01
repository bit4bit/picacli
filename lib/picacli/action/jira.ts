import { Actioner } from './mod.ts'
import { Stater } from '../mod.ts'

export class JiraAction implements Actioner {
    execute(state: Stater): Promise<void> {
    }
}
