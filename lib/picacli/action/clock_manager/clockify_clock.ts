
export class ClockifyClock {
    readonly #BASE_URL: string = "https://api.clockify.me/api"
    private _apiKey: string = ''
    private _workspaceId: string = ''


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

    private async postResource(resource: string, body: object) {
        return await fetch(this.#BASE_URL + resource, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': this._apiKey
            },
            body: JSON.stringify(body)
        })
    }
}
