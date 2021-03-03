import { Stater } from '../state/mod.ts'

export interface DataManager {
    //The 2PC is initiated, the data manager should perform anynecessary steps for saving the data
    tcp_begin(state?: Stater, configurationState?: Stater): Promise<void>

    //In this step the data manager must make sure that any conflicts orerrors are handled. Changes are not permanent yet
        commit(state?: Stater, configurationState?: Stater): Promise<void>

    //This is the last chance for the data manager to abort the globaltransaction. Voting is done by raising (or not) an exception
        tcp_vote(state?: Stater, configurationState?: Stater): Promise<void>

    //This method abandons all changes done, just liketpc_finish it should never fail
        tcp_abort(state?: Stater, configurationState?: Stater): Promise<void>

    //This method makes the changes permanent and should never fail.
        tcp_finish(state?: Stater, configurationState?: Stater): Promise<void>
}
