import {
    assertArrayIncludes,
    assertEquals,
    assertThrows
} from 'https://deno.land/std/testing/asserts.ts'
import * as path from "https://deno.land/std@0.88.0/path/mod.ts";

import {
    ProjectDirectoryResolve,
    ProjectPathResolver
} from './mod.ts'


function testDir(t: () => void | Promise<void>): void {
    async function fn(): Promise<void> {
        const origCwd = Deno.cwd()
        const d = await Deno.makeTempDir()
        Deno.chdir(d)
        try {
            await t()
        } finally {
            Deno.chdir(origCwd)
            await Deno.remove(d, { recursive: true })
        }
    }

    const name = t.name
    Deno.test({ name: `[path] ${name}`, fn })
}

testDir(async function stopWhenFoundFileExpected() {
    await Deno.mkdir('./a/b/c/d', { recursive: true } )
    await Deno.mkdir('./a/b/c/d/e', { recursive: true } )
    await Deno.writeTextFile('./a/.picacli', 'test')
    Deno.chdir('./a/b/c/d')

    const projectPath: ProjectPathResolver = new ProjectDirectoryResolve()
    const expectDirectory = path.resolve('./../../../')
    assertEquals(projectPath.rootDirectory('.picacli'), expectDirectory)
})
