import {
    assertArrayIncludes,
    assertEquals,
    assertThrows
} from 'https://deno.land/std@0.88.0/testing/asserts.ts'

import { path } from '../../deps.ts'
import { Stater } from './mod.ts'
import { StateOverlay } from './state_overlay.ts'
import { StateMemory } from './state_memory.ts'
import { StateJson } from './state_json.ts'

Deno.test('test overlay state', () => {
    // define layers
    const writer = new StateMemory()
    const readers = [
        new StateMemory(),
        new StateMemory()
    ]
    readers[1].set('depth', 2)
    
    const overlay = new StateOverlay(writer, readers)
    
    // write to last layer
    overlay.set('in', 'writer')
    
    // check writable
    assertEquals(overlay.get('in'), 'writer')
    
    // check value get from last layer
    assertEquals(overlay.get('depth'), 2)
})

Deno.test('integration - state json', async () => {
    // define context
    const tmpDir = Deno.makeTempDirSync()
    const statePath = path.join(tmpDir, 'test.json')

    // write state to file
    const stateWrite = new StateJson(statePath)
    stateWrite.set('value', 'abcdef')
    await stateWrite.commit()

    // read state from file and check
    const stateRead = new StateJson(statePath)
    assertEquals(stateRead.get('value'), 'abcdef')
})
