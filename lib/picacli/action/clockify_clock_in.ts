import { Actioner, ActionName, ActionRoot } from './mod.ts'
import { Stater } from '../state/mod.ts'
import { PicacliAction } from '../mod.ts'
import { ClockifyClock } from './clock_manager/clockify_clock.ts'

/**
 *Inicia reloj de clockify
 */
export class ClockifyClockIn implements Actioner {
    private summary: string = ''
    private api_key: string = ''
    private workspace_id: string = ''
    private project_id: string = ''
    private clockManager: ClockifyClock = new ClockifyClock()
    
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
        this.clockManager.apiKey = api_key

        // TODO este parrafo se repite, otra alternativa
        let workspace_id = configurationState.get('clockify.workspace_id') + ''
        if (workspace_id == 'undefined')
            workspace_id = await this.getWorkspaceFromUserInput()
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
            project_id = await this.getProjectFromUserInput(workspace_id)
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
        
        this.clockManager.workspaceId = this.workspace_id


        configurationState.set('clockify.workspace_id', workspace_id)
    }

    async commit(state: Stater, configurationState: Stater): Promise<void> {
        const clock_id = await this.clockManager.in(this.project_id, this.summary)
        state.set('clockify.clock_id', clock_id)
        configurationState.commit()
    }

    async tcp_vote(): Promise<void> {
        console.log('!! clockify clock starts')
    }

    async tcp_abort(): Promise<void> {
    }

    async tcp_finish(): Promise<void> {
    }

    private async getProjectFromUserInput(workspace_id: string) {
        const value = await this.getResourceFromUserInput(
            `/v1/workspaces/${workspace_id}/projects`,
            (record) => { return `${record.name}/${record.clientName}` }
        )

        return value
    }

    private async getWorkspaceFromUserInput() {
        const value = await this.getResourceFromUserInput(
            `/v1/workspaces`,
            (record) => { return record.name }
        )

        return value
    }

    private async getResourceFromUserInput(resource: string, getter_name: (record: any) => string) {

        const records = await this.clockManager.getResource(resource)

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
}
