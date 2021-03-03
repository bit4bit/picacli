import * as path from "https://deno.land/std@0.88.0/path/mod.ts";

import { Stater } from './state/mod.ts'
import { Actioner } from './action/mod.ts'
import { Transaction } from './transaction/mod.ts'

export enum PicacliAction {
    Open = 'open',
    Commit = 'commit'
}

export class Picacli {
    private state: Stater
    private action: Map<string, Actioner[]>
    private transaction: Transaction

    constructor(state: Stater) {
        this.state = state
        this.action = new Map()
        this.transaction = new Transaction(this.state)
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
        const ordering = new Map()
        const actions: Actioner[] = this.action.get(when) || []

        // obtener tabla de pesos segun dependencia runAfter
        for(const action of actions) {
            const after = action.runAfter()
            const item = ordering.get(after) || {actions: [], weight: 0}
            item.weight += 1
            item.actions.push(action)
            if (after == null)
                item.weight += 99
            ordering.set(after, item)
        }

        // ordenar de mayor a menor peso
        const actionsOrdered = Array.from(ordering.entries())
        actionsOrdered
            .sort((a, b): number => {
                const firstWeight = a[1].weight
                const secondWeight = b[1].weight
                return secondWeight - firstWeight
            })

        const actionsOnTransaction = actionsOrdered
            .map(function(entry) {
                return entry[1].actions
            })
            .flat()
        await this.transaction.commit(actionsOnTransaction)
    }
}
