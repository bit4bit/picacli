import {
    assertArrayIncludes,
    assertEquals,
    assertThrows
} from "https://deno.land/std@0.88.0/testing/asserts.ts"

import {CommandLine, Commander} from "./mod.ts"

class FakeCommand implements Commander {
    readonly name: string = "fake-command"
    readonly description: string = "fake command"

    private outputs: string[]

    constructor(outputs: string[]) {
        this.outputs = outputs
    }

    execute(args: string[]) {
        for(const argument of args) {
            this.outputs.push(argument)
        }
    }
}

Deno.test('handle unknown command', () => {
    const cli = new CommandLine()

    assertThrows(() => {
        cli.run(["rare-command", "rare argument"])
    })
})

Deno.test('add command', () => {
    const cli = new CommandLine()
    const output: string[] = []
    const fakeCommand = new FakeCommand(output)

    cli.addCommand(fakeCommand)
    cli.run(["fake-command", "saluton"])
    assertEquals(output[0], "saluton")
})

Deno.test('set default command', () => {
    const output: string[] = []
    const fakeCommand = new FakeCommand(output)
    const cli = new CommandLine({default_command: fakeCommand})

    cli.run(["default", "vi estas"])
    assertEquals(output[0], "vi estas")
})
