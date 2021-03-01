import {
    assertArrayIncludes,
    assertEquals,
    assertThrows
} from 'https://deno.land/std@0.88.0/testing/asserts.ts'

import { Picacli, PicacliAction } from './mod.ts'
import { Stater } from './state/mod.ts'
import { Hash256 } from './hash/sha256.ts'

class FakeState implements Stater {
    private data: Map<string, string> = new Map()
    private project: string = ''

    set(key: string, val: string) {
        this.data.set(this.flat_key(key), val)
    }

    get(key: string) {
        return this.data.get(this.flat_key(key))
    }

    async commit(): Promise<void> {
    }

    private flat_key(key: string) {
        return `${this.project}:${key}`
    }
}

Deno.test('open a project', async () => {
    const fakeState = new FakeState()
    
    const pica = new Picacli(fakeState)
    const summary = 'summary'
    await pica.open(summary)
    assertEquals(fakeState.get('summary'), summary)
})

Deno.test('run actions on project open', async () => {
    const fakeState = new FakeState()
    
    const pica = new Picacli(fakeState)
    const summary = 'summary'

    let actionOutput: string[] = []
    pica.addAction({
        when: function(): PicacliAction {
            return PicacliAction.Open
        },
        execute: async function(state: Stater): Promise<void> {
            actionOutput.push('action 1')
        }
    })
    pica.addAction({
        when: function(): PicacliAction {
            return PicacliAction.Open
        },
        execute: async function(state: Stater): Promise<void> {
            actionOutput.push('action 2')
        }
    })

    await pica.open(summary)
    assertEquals(actionOutput, ['action 1', 'action 2'])
})
