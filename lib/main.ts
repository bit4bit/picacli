// ensambla componentes y define comportamiento de picacli

import * as path from "https://deno.land/std@0.88.0/path/mod.ts";

import {Picacli} from './picacli/mod.ts'
import { JsonState } from './picacli/state/json_state.ts'
import { ProjectDirectoryResolve } from './picacli/path/mod.ts'
import { JiraOpenAction } from './picacli/action/jira.ts'

const PICACLI_CONFIGURATION = '.picacli.json'

const projectPath = new ProjectDirectoryResolve()
const projectRoot = projectPath.rootDirectory(PICACLI_CONFIGURATION)
const state = new JsonState(path.join(projectRoot, '.picacli.state'))
const picacli = new Picacli(state)

picacli.addAction(new JiraOpenAction())

export default picacli