import { Actioner, ActionName, ActionRoot } from './mod.ts'
import { Stater } from '../state/mod.ts'
import { PicacliAction } from '../mod.ts'

/**
 *Inicia reloj de clockify
 */
export class ClockifyClockIn implements Actioner {
    readonly #BASE_URL: string = "https://api.clockify.me/api"
    private api_key: string = ''
    private summary: string = ''
    private workspace_id: string = ''
    private project_id: string = ''
    
    name(): ActionName {
        return 'clock-in'
    }

    when(): PicacliAction {
        return PicacliAction.ClockIn
    }

    runAfter(): ActionName {
        return ActionRoot
    }

    async tcp_begin(state: Stater, configurationState: Stater): Promise<void> {
        const summary = state.get('summary') + ''
        if (!summary)
            throw new Error('required summary')
        
        const api_key = configurationState.get('clockify.api_key') + ''
        if (api_key == 'undefined')
            throw new Error('required clockify.api_key configuration item')
     
        const workspace_id = configurationState.get('clockify.workspace_id') + ''
        if (workspace_id == 'undefined')
            throw new Error(`
required clockify.workspace_id configuration item

in shell run:
$ curl -H 'x-api-key: MY API KEY' https://api.clockify.me/api/v1/workspaces

then register the value at *HOME/.picacli.json* or current project a *.picacli.json*
`)

        const project_id = configurationState.get('clockify.project_id') + ''
        if (project_id == 'undefined')
            throw new Error(`
required clockify.project_id configuration item

in shell run:
$  curl -H 'x-api-key: MY API KEY' https://api.clockify.me/api/v1/workspaces/MY WORKSPACE ID/projects

then register the value at *HOME/.picacli.json* or current project a *.picacli.json*
`)
        
        this.api_key = api_key
        this.workspace_id = workspace_id
        this.project_id = project_id
        this.summary = summary
    }

    async commit(state: Stater): Promise<void> {
        const response = await this.call('/v1/workspaces/' + this.workspace_id + '/time-entries', {
            description: this.summary,
            projectId: this.project_id
        })

        if (response.status != 201)
            throw new Error('failed to active clock')

        const body = await response.json()
        state.set('clockify.clock_id', body.id)
    }

    async tcp_vote(): Promise<void> {
        console.log('!! clockify clock starts')
    }

    async tcp_abort(): Promise<void> {
    }

    async tcp_finish(): Promise<void> {
    }

    private async call(resource: string, body: object) {
        return await fetch(this.#BASE_URL + resource, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': this.api_key
            },
            body: JSON.stringify(body)
        })
    }
}
