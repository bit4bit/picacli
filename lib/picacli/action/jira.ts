import { Actioner } from './mod.ts'
import { Stater } from '../state/mod.ts'
import { PicacliAction } from '../mod.ts'

/**
 * Crea task en jira
 */
export class JiraOpenAction implements Actioner {
    when(): PicacliAction {
        return PicacliAction.Open
    }

    async tcp_begin(): Promise<void> {
    }

    async commit(): Promise<void> {
    }

    async tcp_vote(): Promise<void> {
    }

    async tcp_abort(): Promise<void> {
    }

    async tcp_finish(): Promise<void> {
        console.log(`Jira Open Running for ${state.get('summary')}`)
    }
}
