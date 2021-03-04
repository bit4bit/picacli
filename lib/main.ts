// ensambla componentes y define comportamiento de picacli

import * as path from "https://deno.land/std@0.88.0/path/mod.ts";

import {Picacli} from './picacli/mod.ts'
import { JsonState } from './picacli/state/json_state.ts'
import { StateOverlay } from './picacli/state/state_overlay.ts'

import { ProjectDirectoryResolve } from './picacli/path/mod.ts'
import { JiraOpenAction } from './picacli/action/jira.ts'
import { ClockifyClockIn } from './picacli/action/clockify_clock_in.ts'

const PICACLI_CONFIGURATION = '.picacli.json'
const homeUser = Deno.env.get('HOME')

const projectPath = new ProjectDirectoryResolve()
// get current project directory path
const projectRoot = projectPath.rootDirectory([PICACLI_CONFIGURATION, '.git'])

// state of current project
const state = new JsonState(path.join(projectRoot, '.picacli.state'))

// configuration state of current project
const projectConfigurationState = new JsonState(path.join(projectRoot, PICACLI_CONFIGURATION))
let userConfigurationStates = []
if (homeUser) {
    userConfigurationStates.push(
        new JsonState(path.join(homeUser, PICACLI_CONFIGURATION))
    )
}
const configurationState = new StateOverlay(projectConfigurationState,
                                            userConfigurationStates)

const picacli = new Picacli(state, configurationState)
picacli.addAction(new JiraOpenAction())
picacli.addAction(new ClockifyClockIn())

export default picacli
