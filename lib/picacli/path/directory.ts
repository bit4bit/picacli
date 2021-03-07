import { walkSync, path } from '../../deps.ts'

export class ProjectDirectoryResolve {
    rootDirectory(filenames: string[]): string {
        const directory = Deno.cwd()
        return this.findFilename(filenames, directory)
    }

    private findFilename(stopFilenames: string[], directory: string): string {
        for(const entry of walkSync(directory)) {
            const name = path.basename(entry.path)

            if(stopFilenames.includes(name)) {
                return path.dirname(entry.path)
            }

            if (entry.isDirectory)
                continue
            
            if (['.'].includes(name))
                continue
        }

        return this.findFilename(stopFilenames, path.join(directory, '../'))
    }

}
