import {
    assertArrayIncludes,
    assertEquals,
    assertThrows
} from 'https://deno.land/std@0.88.0/testing/asserts.ts'

import {Picacli} from './mod.ts'
import {Stater} from './state/mod.ts'
import {Hash256} from './hash/sha256.ts'

class FakeState implements Stater {
    private data: Map<string, string> = new Map()
    private project: string = ''

    open(project: string) {
        this.project = project
    }
    
    close() {
    }
    
    set(key: string, val: string) {
        this.data.set(this.flat_key(key), val)
    }

    get(key: string) {
        return this.data.get(this.flat_key(key))
    }

    commit(): void {
    }

    private flat_key(key: string) {
        return `${this.project}:${key}`
    }
}

Deno.test('open directory as project', () => {
    const tmpDir = Deno.makeTempDirSync()
    const fakeState = new FakeState()
    const hasher = new Hash256()
    
    const pica = new Picacli(fakeState, hasher)
    pica.open(tmpDir)
    assertEquals(fakeState.get('path'), tmpDir)
})
