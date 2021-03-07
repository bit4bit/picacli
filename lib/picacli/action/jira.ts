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

    async tcpBegin(state: Stater, configurationState: Stater) {
        const token = configurationState.get('jira.token')
        if (!token) throw new Error('required jira.token')
    }

    async commit(state: Stater)  {
        const summary = state.get('summary')
        if (!summary) throw new Error('need summary')        
        state.set('jira.summary', summary)
    }

    async tcpVote() {
    }

    async tcpAbort() {
    }

    async tcpFinish(state: Stater) {
        const summary = state.get('jira.summary') || 'invalid'
        console.log(`Jira Open Running for ${summary}`)
    }
}
