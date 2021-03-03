import { Stater } from '../state/mod.ts'
import { PicacliAction } from '../mod.ts'
import { DataManager } from '../transaction/datamanager.ts'

export const ActionRoot = null
export type ActionName = string | typeof ActionRoot

export interface Actioner extends DataManager {
    name(): ActionName
    when(): PicacliAction
    runAfter(): ActionName
}
