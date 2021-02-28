import { walkSync } from 'https://deno.land/std/fs/walk.ts'
import * as path from "https://deno.land/std@0.88.0/path/mod.ts";

export class ProjectDirectoryResolve {
    rootDirectory(filename: string): string {
        const directory = Deno.cwd()
        return this.findFilename(filename, directory)
    }

    private findFilename(stop_filename: string, directory: string): string {
        for(const entry of walkSync(directory)) {
            const name = path.basename(entry.path)

            if (entry.isDirectory)
                continue
            
            if (['.'].includes(name))
                continue

            if (name == stop_filename) {
                return path.dirname(entry.path)
            }
        }

        return this.findFilename(stop_filename, path.join(directory, '../'))
    }

}
