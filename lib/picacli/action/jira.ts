import { Actioner } from './mod.ts'
import { Stater } from '../state/mod.ts'
import { PicacliAction } '../mod.ts'

export class JiraOpenAction implements Actioner {
    when(): PicacliAction {
        PicacliAction.Open
    }

    execute(state: Stater): Promise<void> {
    }
}
