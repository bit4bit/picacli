import { Actioner, ActionName, ActionRoot } from './mod.ts'
import { Stater } from '../state/mod.ts'
import { PicacliAction } from '../mod.ts'
import { Hasher } from '../hash/mod.ts'

export class LocalBranchOpen implements Actioner {
    private hasher: Hasher

    constructor(hasher: Hasher) {
        this.hasher = hasher
    }
    
    when(): PicacliAction {
        return PicacliAction.Open
    }

    name(): ActionName {
        return 'local-branch-open'
    }

    runAfter(): ActionName {
        return 'jira-open'
    }


    async tcpBegin(state: Stater) {
        const summary = state.get('summary')
        if (!summary) throw new Error('required summary')
    }

    async commit(state: Stater) {
        if (state.has('local_branch'))
            return
        
        // TODO implementar un extrador de nombres basado en el summary
        // y el issue de jira
        const branchName = this.generateBranchName(state.get('summary') + '')

        await this.changeGitLocalBranch(branchName)
        
        state.set('local_branch', branchName)
    }

    async tcpVote() {
    }

    async tcpAbort() {
    }

    async tcpFinish(state: Stater) {
    }

    private async changeGitLocalBranch(name: string) {
        const git = Deno.run({
            cmd: ["git", "checkout", "-b", name],
            stdout: "piped",
            stderr: "piped"
        })

        const { code } = await git.status()
        if (code !== 0) {
            // TOMADO https://deno.land/manual@v1.8.1/examples/subprocess
            const rawError = await git.stderrOutput();
            const errorString = new TextDecoder().decode(rawError);
            throw new Error(`failed to change git local branch: ${errorString} `)
        }
        console.log(`Open local branch ${name}`)
    }

    private generateBranchName(summary: string) {
        return this.hasher.create(summary)
    }
}
