import { DataManager } from './datamanager.ts'
import { Stater } from '../state/mod.ts'

// https://downloads.tryton.org/TUB2016/distributed.pdf
export class Transaction {
    private state: Stater

    constructor(state: Stater) {
        this.state = state
    }

    async commit(dataManagers: DataManager[]) {
        try {
            for(const datamanager of dataManagers) {
                await datamanager.tcp_begin()
            }
            for(const datamanager of dataManagers) {
                await datamanager.commit()
            }
            for(const datamanager of dataManagers) {
                await datamanager.tcp_vote()
            }

            await this.state.commit()

            for(const datamanager of dataManagers) {
                // TODO si ahi exception error critico
                // esta no debe fallar
                await datamanager.tcp_finish()
            }
        } catch(e) {
            await this.rollback(dataManagers)
            throw e
        }
    }

    async rollback(dataManagers: DataManager[]) {
        for(const datamanager of dataManagers) {
            await datamanager.tcp_abort()
        }
        await this.state.rollback()
    }
}
