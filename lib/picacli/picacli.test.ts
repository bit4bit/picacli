import {
    assertArrayIncludes,
    assertEquals,
    assertThrows
} from 'https://deno.land/std@0.88.0/testing/asserts.ts'

import { ActionName, ActionRoot } from './action/mod.ts'
import { Picacli, PicacliAction } from './mod.ts'
import { Transaction } from './transaction/mod.ts'

import { Stater, StateValue } from './state/mod.ts'
import { Hash256 } from './hash/sha256.ts'
import { StateMemory as FakeState } from './state/state_memory.ts'


Deno.test('open a project', async () => {
    const fakeState = new FakeState()
    
    const pica = new Picacli(fakeState, fakeState)
    const summary = 'summary'
    await pica.open(summary)
    assertEquals(fakeState.get('summary'), summary)
})

Deno.test('run actions on project open', async () => {
    const fakeState = new FakeState()
    
    const pica = new Picacli(fakeState, fakeState)
    const summary = 'summary'

    const actionOutput: string[] = []
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

        async tcpBegin() {
        },
        async commit() {
        },
        async tcpVote() {
        },
        async tcpAbort() {
        },
        async tcpFinish() {
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
        async tcpBegin() {
        },
        async commit() {
        },
        async tcpVote() {
        },
        async tcpAbort() {
        },
        async tcpFinish() {
            actionOutput.push('action 2')
        }
    })

    await pica.open(summary)
    assertEquals(actionOutput, ['action 1', 'action 2'])
})


Deno.test('run actions in order of dependency', async () => {
    const fakeState = new FakeState()
    const pica = new Picacli(fakeState, fakeState)

    const actionOutput: string[] = []
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
        async tcpBegin(): Promise<void> {
        },
        async commit(): Promise<void> {
        },
        async tcpVote(): Promise<void> {
        },
        async tcpAbort(): Promise<void> {
        },
        async tcpFinish(): Promise<void> {
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
        async tcpBegin(): Promise<void> {
        },
        async commit(): Promise<void> {
        },
        async tcpVote(): Promise<void> {
        },
        async tcpAbort(): Promise<void> {
        },
        async tcpFinish(): Promise<void> {
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
        async tcpBegin(): Promise<void> {
        },
        async commit(): Promise<void> {
        },
        async tcpVote(): Promise<void> {
        },
        async tcpAbort(): Promise<void> {
        },
        async tcpFinish(): Promise<void> {
            actionOutput.push('action 2')
        }
    })

    await pica.open('test')
    assertEquals(actionOutput, ['action 1', 'action 0', 'action 2'])
})
