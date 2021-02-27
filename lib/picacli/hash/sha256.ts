import { Hasher } from './mod.ts'

import { createHash } from 'https://deno.land/std@0.88.0/hash/mod.ts'

export class Hash256 implements Hasher {
    create(from: string): string {
        const hash = createHash('sha256')
        hash.update(from)
        return hash.toString('hex')
    }
}
