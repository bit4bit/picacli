import {
    assertArrayIncludes,
    assertEquals,
    assertThrows
} from 'https://deno.land/std@0.88.0/testing/asserts.ts'


import { Stater } from './mod.ts'
import { StateOverlay } from './state_overlay.ts'
import { StateMemory } from './state_memory.ts'

Deno.test('test overlay state', () => {
    const writer = new StateMemory()
    const readers = [
        new StateMemory(),
        new StateMemory()
    ]
    readers[1].set('depth', 2)
    
    const overlay = new StateOverlay(writer, readers)
    overlay.set('in', 'writer')
    assertEquals(overlay.get('in'), 'writer')
    assertEquals(overlay.get('depth'), 2)
})
