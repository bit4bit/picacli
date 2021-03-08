import { Actioner, ActionName, ActionRoot } from './mod.ts'
import { Stater } from '../state/mod.ts'
import { PicacliAction } from '../mod.ts'

export class From implements Actioner {
    private open_id: string = ''
    private username: string = ''
    private password: string = ''
    private domain: string = ''
    
    name(): ActionName {
        return 'open-from'
    }

    when(): PicacliAction {
        return PicacliAction.Open
    }

    runAfter(): ActionName {
        return ActionRoot
    }

    async tcpBegin(state: Stater, configurationState: Stater) {
        const domain = configurationState.get('jira.domain') + ''
        if (domain == '')
            throw new Error('required configuration jira.domain')
        
        const username = configurationState.get('jira.username') + ''
        if (username == '')
            throw new Error('required configuration jira.username')

        const password = configurationState.get('jira.password') + ''
        if (password == '')
            throw new Error('required configuration jira.password')
        
        const open_id = state.get('open_id') + ''
        if (open_id == '')
            throw new Error('required open_id')

        this.open_id = open_id
        this.username = username
        this.password = password
        this.domain = domain
    }

    async commit(state: Stater) {
        const issue = await this.getIssueFromJira({domain: this.domain, username: this.username, password: this.password}, this.open_id)
        state.set('summary', issue.summary)
        state.set('key', issue.key)
    }

    async tcpVote() {
    }

    async tcpAbort() {
    }

    async tcpFinish(state: Stater) {
        console.log('Using summary: ' + state.get('summary'))
    }

    private async getIssueFromJira(credential: {domain: string, username: string, password: string}, open_id: string) {
        const url = `https://${credential.domain}/rest/api/2/issue/${open_id}`
        const basicauth = btoa(`${credential.username}:${credential.password}`)
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${basicauth}`
            }
        })

        const json = await res.json()
        return {key: json.key, summary: json.fields.summary}
    }
}
