import { Actioner, ActionName, ActionRoot } from './mod.ts'
import { Stater } from '../state/mod.ts'
import { PicacliAction } from '../mod.ts'
import { ClockifyClock } from './clock_manager/clockify_clock.ts'

/**
 *Inicia reloj de clockify
 */
export class ClockIn implements Actioner {
    private summary = ''
    private apiKey = ''
    private workspaceId = ''
    private projectId = ''
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

    async tcpBegin(state: Stater, configurationState: Stater) {
        const summary = state.get('summary') + ''
        if (!summary)
            throw new Error('required summary')
        
        const apiKey = configurationState.get('clockify.api_key') + ''
        if (apiKey == 'undefined')
            throw new Error('required clockify.apiKey configuration item')
        this.clockManager.apiKey = apiKey

        // TODO este parrafo se repite, otra alternativa
        let workspaceId = configurationState.get('clockify.workspaceId') + ''
        if (workspaceId == 'undefined')
            workspaceId = await this.getWorkspaceFromUserInput()
            if (!workspaceId)
                throw new Error(`
required clockify.workspaceId configuration item

in shell run:
$ curl -H 'x-api-key: MY API KEY' https://api.clockify.me/api/v1/workspaces

then register the value at *HOME/.picacli.json* or current project a *.picacli.json*
`)

        let projectId = configurationState.get('clockify.project_id') + ''
        if (projectId == 'undefined')
            // TODO no esclaro el uso de workspaceId en esta situacion
            projectId = await this.getProjectFromUserInput(workspaceId)
            if (!projectId)
                throw new Error(`
required clockify.projectId configuration item

in shell run:
$  curl -H 'x-api-key: MY API KEY' https://api.clockify.me/api/v1/workspaces/MY WORKSPACE ID/projects

then register the value at *HOME/.picacli.json* or current project a *.picacli.json*
`)

        this.apiKey = apiKey
        this.workspaceId = workspaceId
        this.projectId = projectId
        this.summary = summary
        
        this.clockManager.workspaceId = this.workspaceId


        configurationState.set('clockify.workspace_id', workspaceId)
    }

    async commit(state: Stater, configurationState: Stater) {
        const clockId = await this.clockManager.in(this.projectId, this.summary)
        state.set('clockify.clock_id', clockId)
        configurationState.commit()
    }

    async tcpVote() {
        console.log('!! clockify clock starts')
    }

    async tcpAbort() {
    }

    async tcpFinish() {
    }

    private async getProjectFromUserInput(workspaceId: string) {
        const value = await this.getResourceFromUserInput(
            `/v1/workspaces/${workspaceId}/projects`,
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

    private async getResourceFromUserInput(resource: string, getterName: (record: any) => string) {

        const records = await this.clockManager.getResource(resource)

        const options = []
        for(const record of records) {
            const option = options.length
            const name = getterName(record)

            console.log(`${option}: ${name}`)

            options.push(record.id)
        }

        const selected = parseInt(await this.readUserInput('choose option'))
        return options[selected]
    }

    private async readUserInput(message: string) {
        const input = prompt(message)
        if (input)
            return input.trim()
        return ''
    }
}
