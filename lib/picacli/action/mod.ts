import { Stater } from '../state/mod.ts'
import { PicacliAction } from '../mod.ts'

export const ActionRoot = null
export type ActionName = string | typeof ActionRoot

export interface Actioner {
    name(): ActionName
    when(): PicacliAction
    runAfter(): ActionName
    execute(state: Stater): Promise<void>
}
