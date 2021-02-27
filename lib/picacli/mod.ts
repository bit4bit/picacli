import * as path from "https://deno.land/std@0.88.0/path/mod.ts";

import { Storer } from './store/mod.ts'
import { Hasher } from './hash/mod.ts'

export class Picacli {
    private store: Storer
    private hash: Hasher

    constructor(store: Storer, hash: Hasher) {
        this.store = store
        this.hash = hash
    }

    open(directory: string) {
        const project_uuid = this.hash.create(directory)

        this.store.open(project_uuid)
        this.store.set('path', directory)
        this.store.commit()
        
        console.log(`open ${directory}`)
    }

    close() {
        this.store.close()
    }
}
