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

    async execute(state: Stater): Promise<void> {
        console.log(`Jira Open Running for ${state.get('summary')}`)
    }
}
