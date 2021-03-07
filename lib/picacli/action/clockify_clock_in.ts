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

        // TODO este parrafo se repite, otra alternativa
        let workspace_id = configurationState.get('clockify.workspace_id') + ''
        if (workspace_id == 'undefined')
            workspace_id = await this.getWorkspaceFromUserInput(api_key)
            if (!workspace_id)
                throw new Error(`
required clockify.workspace_id configuration item

in shell run:
$ curl -H 'x-api-key: MY API KEY' https://api.clockify.me/api/v1/workspaces

then register the value at *HOME/.picacli.json* or current project a *.picacli.json*
`)

        let project_id = configurationState.get('clockify.project_id') + ''
        if (project_id == 'undefined')
            // TODO no esclaro el uso de workspace_id en esta situacion
            project_id = await this.getProjectFromUserInput(api_key, workspace_id)
            if (!project_id)
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

        configurationState.set('clockify.workspace_id', workspace_id)
    }

    async commit(state: Stater, configurationState: Stater): Promise<void> {
        const response = await this.postResource(this.api_key, '/v1/workspaces/' + this.workspace_id + '/time-entries', {
            description: this.summary,
            projectId: this.project_id
        })

        // TODO se trae logica de http a este contexto
        if (response.status != 201)
            throw new Error('failed to active clock')

        const body = await response.json()

        state.set('clockify.clock_id', body.id)
        configurationState.commit()
    }

    async tcp_vote(): Promise<void> {
        console.log('!! clockify clock starts')
    }

    async tcp_abort(): Promise<void> {
    }

    async tcp_finish(): Promise<void> {
    }

    private async getProjectFromUserInput(api_key: string, workspace_id: string) {
        const value = await this.getResourceFromUserInput(
            api_key,
            `/v1/workspaces/${workspace_id}/projects`,
            (record) => { return `${record.name}/${record.clientName}` }
        )

        return value
    }

    private async getWorkspaceFromUserInput(api_key: string) {
        const value = await this.getResourceFromUserInput(api_key,
            `/v1/workspaces`,
            (record) => { return record.name }
        )

        return value
    }

    private async getResourceFromUserInput(api_key: string, resource: string, getter_name: (record: any) => string) {
        const records = await this.getResource(api_key, resource)

        let options = []
        for(const record of records) {
            const option = options.length
            const name = getter_name(record)

            console.log(`${option}: ${name}`)

            options.push(record.id)
        }

        const selected = parseInt(await this.readUserInput('choose option'))
        return options[selected]
    }

    private async readUserInput(message: string) {
        //TOMADO DE https://www.danvega.dev/blog/2020/06/03/deno-stdin-stdout/
        await Deno.stdout.write(new TextEncoder().encode(message + ": "));
        
        const buf = new Uint8Array(1024);
        const n = <number>await Deno.stdin.read(buf)
        return new TextDecoder().decode(buf.subarray(0, n)).trim()
    }

    private async getResource(api_key: string, name: string) {
        const res = await fetch(this.#BASE_URL + name, {
            method: 'GET',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': api_key
            },
        })
        return await res.json()
    }

    private async postResource(api_key: string, resource: string, body: object) {
        return await fetch(this.#BASE_URL + resource, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': api_key
            },
            body: JSON.stringify(body)
        })
    }

}
