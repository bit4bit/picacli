import * as path from "https://deno.land/std@0.88.0/path/mod.ts";

import { Stater } from './state/mod.ts'
import { Hasher } from './hash/mod.ts'

export class Picacli {
    private state: Stater
    private hash: Hasher

    constructor(state: Stater, hash: Hasher) {
        this.state = state
        this.hash = hash
    }

    open(directory: string) {
        const project_uuid = this.hash.create(directory)

        this.state.open(project_uuid)
        this.state.set('path', directory)
        this.state.commit()
        
        console.log(`open ${directory}`)
    }

    close() {
        this.state.close()
    }
}
