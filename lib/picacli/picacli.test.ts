import {
    assertArrayIncludes,
    assertEquals,
    assertThrows
} from 'https://deno.land/std@0.88.0/testing/asserts.ts'

import { ActionName, ActionRoot } from './action/mod.ts'
import { Picacli, PicacliAction } from './mod.ts'
import { Transaction } from './transaction/mod.ts'

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

    async rollback(): Promise<void> {
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
        name: function(): ActionName {
            return 'action1'
        },
        runAfter: function() {
            return ActionRoot
        },
        when: function(): PicacliAction {
            return PicacliAction.Open
        },

        async tcp_begin() {
        },
        async commit() {
        },
        async tcp_vote() {
        },
        async tcp_abort() {
        },
        async tcp_finish() {
            actionOutput.push('action 1')
        }
    })
    pica.addAction({
        name: function(): ActionName {
            return 'action1'
        },
        runAfter: function() {
            return ActionRoot
        },
        when: function(): PicacliAction {
            return PicacliAction.Open
        },
        async tcp_begin() {
        },
        async commit() {
        },
        async tcp_vote() {
        },
        async tcp_abort() {
        },
        async tcp_finish() {
            actionOutput.push('action 2')
        }
    })

    await pica.open(summary)
    assertEquals(actionOutput, ['action 1', 'action 2'])
})


Deno.test('run actions in order of dependency', async () => {
    const fakeState = new FakeState()
    const pica = new Picacli(fakeState)

    let actionOutput: string[] = []
    pica.addAction({
        name: function() {
            return 'action0'
        },
        runAfter: function() {
            return 'action1'
        },
        when: function(): PicacliAction {
            return PicacliAction.Open
        },
        async tcp_begin() {
        },
        async commit() {
        },
        async tcp_vote() {
        },
        async tcp_abort() {
        },
        async tcp_finish() {
            actionOutput.push('action 0')
        }
    })
    pica.addAction({
        name: function() {
            return 'action1'
        },
        when: function(): PicacliAction {
            return PicacliAction.Open
        },
        runAfter: function() {
            return ActionRoot
        },
        async tcp_begin() {
        },
        async commit() {
        },
        async tcp_vote() {
        },
        async tcp_abort() {
        },
        async tcp_finish() {
            actionOutput.push('action 1')
        }
    })
    pica.addAction({
        name: function() {
            return 'action2'
        },
        runAfter: function() {
            return 'action1'
        },
        when: function(): PicacliAction {
            return PicacliAction.Open
        },
        async tcp_begin() {
        },
        async commit() {
        },
        async tcp_vote() {
        },
        async tcp_abort() {
        },
        async tcp_finish() {
            actionOutput.push('action 2')
        }
    })

    await pica.open('test')
    assertEquals(actionOutput, ['action 1', 'action 0', 'action 2'])
})
