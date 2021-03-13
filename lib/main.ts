// ensambla componentes y define comportamiento de picacli

import { path } from './deps.ts'

import { Picacli } from './picacli/mod.ts'
import { JsonState } from './picacli/state/json_state.ts'
import { StateOverlay } from './picacli/state/state_overlay.ts'

import { ProjectDirectoryResolve } from './picacli/path/mod.ts'
import { JiraOpenAction } from './picacli/action/jira.ts'
import { ClockIn } from './picacli/action/clock_in.ts'
import { From } from './picacli/action/from.ts'
import { LocalBranchOpen } from './picacli/action/local_branch_open.ts'

import { Hash256 } from './picacli/hash/sha256.ts'

const PICACLI_CONFIGURATION = '.picacli.json'
const homeUser = Deno.env.get('HOME')

const projectPath = new ProjectDirectoryResolve()
// get current project directory path
const projectRoot = projectPath.rootDirectory([PICACLI_CONFIGURATION, '.git'])

// state of current project
const state = new JsonState(path.join(projectRoot, '.picacli.state'))

// configuration state of current project
const projectConfigurationState = new JsonState(path.join(projectRoot, PICACLI_CONFIGURATION))
const userConfigurationStates = []
if (homeUser) {
    userConfigurationStates.push(
        new JsonState(path.join(homeUser, PICACLI_CONFIGURATION))
    )
}
const configurationState = new StateOverlay(projectConfigurationState,
                                            userConfigurationStates)

const picacli = new Picacli(state, configurationState)

picacli.addAction(new JiraOpenAction())
picacli.addAction(new ClockIn())
picacli.addAction(new From())
picacli.addAction(new LocalBranchOpen(new Hash256()))

export default picacli
