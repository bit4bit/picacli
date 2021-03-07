import {
    assertArrayIncludes,
    assertEquals,
    assertThrowsAsync
} from 'https://deno.land/std@0.88.0/testing/asserts.ts'

import { Transaction } from './mod.ts'
import { Stater } from '../state/mod.ts'

class FakeState implements Stater {
    private data: Map<string, string> = new Map()
    private project = ''

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
    const transaction = new Transaction(fakeState, fakeState)

    const outputs: string[] = []
    
    const datamanagers = [
        {
            tcpBegin() {
            },
            commit() {
            },
            tcpVote() {
                outputs.push('vote0')
            },
            tcpAbort() {
                outputs.push('abort0')
            },
            tcpFinish() {
            }
        },
        {
            tcpBegin() {
            },
            commit() {
            },
            tcpVote() {
                throw new Error()
            },
            tcpAbort() {
                outputs.push('abort1')
            },
            tcpFinish() {
            }
        },
        {
            tcpBegin() {
            },
            commit() {
            },
            tcpVote() {
            },
            tcpAbort() {
            },
            tcpFinish() {
                outputs.push('finish2')
            }
        }
    ]

    await assertThrowsAsync(async () => {
        await transaction.commit(datamanagers)
    }, Error)

    assertEquals(outputs, ['vote0', 'abort0', 'abort1'])
})
