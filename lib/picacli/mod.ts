import * as path from "https://deno.land/std@0.88.0/path/mod.ts";

import { Stater } from './state/mod.ts'
import { Actioner } from './action/mod.ts'

export enum PicacliAction {
    Open = 'open',
    Commit = 'commit'
}

export class Picacli {
    private state: Stater
    private action: Map<string, Actioner[]>
    
    constructor(state: Stater) {
        this.state = state
        this.action = new Map()
    }

    addAction(action: Actioner) {
        const when = action.when()
        const actions = this.action.get(when) || []

        actions.push(action)
        this.action.set(when, actions)
    }

    async open(summary: string) {
        this.state.set('summary', summary)
        return await this.runActionsFor(PicacliAction.Open)
    }

    async commit() {
        await this.state.commit()
        return await this.runActionsFor(PicacliAction.Commit)
    }

    private async runActionsFor(when: string) {
        for(const entry of this.action.entries()) {
            const when = entry[0]
            const actions = entry[1]

            for(const action of actions)
                await action.execute(this.state)
        }
    }
}
