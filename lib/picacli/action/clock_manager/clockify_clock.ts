
export class ClockifyClock {
    readonly #BASE_URL: string = "https://api.clockify.me/api"
    private _apiKey = ''
    private _workspaceId = ''


    public set apiKey(key: string) {
        this._apiKey = key
    }

    public set workspaceId(id: string) {
        this._workspaceId = id
    }

    async in(projectId: string, summary: string): Promise<string> {
        const response = await this.postResource('/v1/workspaces/' + this._workspaceId + '/time-entries', {
            description: summary,
            projectId: projectId
        })

        // TODO se trae logica de http a este contexto
        if (response.status != 201)
            throw new Error('failed to active clock')

        const body = await response.json()
        return body.id
    }

    async out(clockId: string) {
        const at = (new Date()).toISOString()
        const response = await this.putResource('/workspaces/' + this._workspaceId + '/timeEntries/endStarted', {
            end: at
        })

        if (response.status != 200)
            throw new Error('failed to stop active clock')

        return true
    }

    // TODO fuga de metodo interno
    public async getResource(name: string) {
        const res = await fetch(this.#BASE_URL + name, {
            method: 'GET',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': this._apiKey
            },
        })
        return await res.json()
    }

    private async postResource(resource: string, body: unknown) {
        return await this.doResource('POST', resource, body)
    }

    private async putResource(resource: string, body: unknown) {
        return await this.doResource('PUT', resource, body)
    }

    private async doResource(method: string, resource: string, body: unknown) {
        return await fetch(this.#BASE_URL + resource, {
            method: method,
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': this._apiKey
            },
            body: JSON.stringify(body)
        })        
    }
}
