import {
    assertArrayIncludes,
    assertEquals,
    assertThrows
} from 'https://deno.land/std@0.88.0/testing/asserts.ts'

import {Picacli} from './mod.ts'
import {Storer} from './store/mod.ts'
import {Hash256} from './hash/sha256.ts'

class FakeStore implements Storer {
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
    const fakeStore = new FakeStore()
    const hasher = new Hash256()
    
    const pica = new Picacli(fakeStore, hasher)
    pica.open(tmpDir)
    assertEquals(fakeStore.get('path'), tmpDir)
})
