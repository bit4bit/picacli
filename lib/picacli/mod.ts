import * as path from "https://deno.land/std@0.88.0/path/mod.ts";

import { Stater } from './state/mod.ts'

export class Picacli {
    private state: Stater
    
    constructor(state: Stater) {
        this.state = state
    }

    open(summary: string) {
        this.state.set('summary', summary)
    }

    commit() {
        this.state.commit()
    }
}
