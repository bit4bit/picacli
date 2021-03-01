import { Stater } from '../state/mod.ts'
import { PicacliAction } from '../mod.ts'

export interface Actioner {
    when(): PicacliAction
    execute(state: Stater): Promise<void>
}
