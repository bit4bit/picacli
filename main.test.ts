import {
    assertArrayIncludes,
    assertEquals,
    assertThrows
} from 'https://deno.land/std@0.88.0/testing/asserts.ts'


import Picacli from './lib/main.ts'
import { Picacli as PicacliClass } from './lib/picacli/mod.ts'

Deno.test('integration - main instance of picacli', () => {
    assertEquals(Picacli instanceof PicacliClass, true)
})
