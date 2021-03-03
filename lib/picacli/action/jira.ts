import { Actioner, ActionName, ActionRoot } from './mod.ts'
import { Stater } from '../state/mod.ts'
import { PicacliAction } from '../mod.ts'

/**
 * Crea task en jira
 */
export class JiraOpenAction implements Actioner {
    when(): PicacliAction {
        return PicacliAction.Open
    }

    name(): ActionName {
        return 'jira-open'
    }

    runAfter(): ActionName {
        return ActionRoot
    }

    async tcp_begin(state: Stater, configurationState: Stater): Promise<void> {
        const token = configurationState.get('jira.token')
        if (!token) throw new Error('required jira.token')
    }

    async commit(state: Stater): Promise<void> {
        const summary = state.get('summary')
        if (!summary) throw new Error('need summary')        
        state.set('jira.summary', summary)
    }

    async tcp_vote(): Promise<void> {
    }

    async tcp_abort(): Promise<void> {
    }

    async tcp_finish(state: Stater): Promise<void> {
        const summary = state.get('jira.summary') || 'invalid'
        console.log(`Jira Open Running for ${summary}`)
    }
}
