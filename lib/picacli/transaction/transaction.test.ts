import {
    assertArrayIncludes,
    assertEquals,
    assertThrowsAsync
} from 'https://deno.land/std@0.88.0/testing/asserts.ts'

import { Transaction } from './mod.ts'
import { Stater } from '../state/mod.ts'

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

Deno.test('test rollback on fail transaction', async () => {
    const fakeState = new FakeState()
    const transaction = new Transaction(fakeState)

    const outputs: string[] = []
    
    const datamanagers = [
        {
            async tcp_begin() {
            },
            async commit() {
            },
            async tcp_vote() {
                outputs.push('vote0')
            },
            async tcp_abort() {
                outputs.push('abort0')
            },
            async tcp_finish() {
            }
        },
        {
            async tcp_begin() {
            },
            async commit() {
            },
            async tcp_vote() {
                throw new Error()
            },
            async tcp_abort() {
                outputs.push('abort1')
            },
            async tcp_finish() {
            }
        },
                {
            async tcp_begin() {
            },
            async commit() {
            },
            async tcp_vote() {
            },
            async tcp_abort() {
            },
            async tcp_finish() {
                outputs.push('finish2')
            }
        }
    ]

    await assertThrowsAsync(async () => {
        await transaction.commit(datamanagers)
    }, Error)

    assertEquals(outputs, ['vote0', 'abort0', 'abort1'])
})
