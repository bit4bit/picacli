export { walkSync } from 'https://deno.land/std/fs/walk.ts'

// fix error: ReferenceError: normalize is not defined
import { join, dirname, basename, normalize } from "https://deno.land/std@0.88.0/path/mod.ts";
export class path {
    static join = join
    static dirname = dirname
    static basename = basename
    static normalize = normalize
}

