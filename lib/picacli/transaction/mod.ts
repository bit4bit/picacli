import { DataManager } from './datamanager.ts'
import { Stater } from '../state/mod.ts'

// https://downloads.tryton.org/TUB2016/distributed.pdf
export class Transaction {
    private state: Stater
    private configurationState: Stater

    constructor(state: Stater, configurationState: Stater) {
        this.state = state
        this.configurationState = configurationState
    }

    async commit(dataManagers: DataManager[]) {
        try {
            for(const datamanager of dataManagers) {
                await datamanager.tcp_begin(this.state, this.configurationState)
            }
            for(const datamanager of dataManagers) {
                await datamanager.commit(this.state, this.configurationState)
            }
            for(const datamanager of dataManagers) {
                await datamanager.tcp_vote(this.state, this.configurationState)
            }

            await this.state.commit()

            for(const datamanager of dataManagers) {
                // TODO si ahi exception error critico
                // esta no debe fallar
                await datamanager.tcp_finish(this.state, this.configurationState)
            }
        } catch(e) {
            await this.rollback(dataManagers)
            throw e
        }
    }

    async rollback(dataManagers: DataManager[]) {
        for(const datamanager of dataManagers) {
            await datamanager.tcp_abort(this.state, this.configurationState)
        }
        await this.state.rollback()
    }
}
