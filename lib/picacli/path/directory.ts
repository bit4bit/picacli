import { walkSync, path } from '../../deps.ts'

export class ProjectDirectoryResolve {
    rootDirectory(filenames: string[]): string {
        const directory = Deno.cwd()
        return this.findFilename(filenames, directory)
    }

    private findFilename(stop_filenames: string[], directory: string): string {
        for(const entry of walkSync(directory)) {
            const name = path.basename(entry.path)

            if(stop_filenames.includes(name)) {
                return path.dirname(entry.path)
            }

            if (entry.isDirectory)
                continue
            
            if (['.'].includes(name))
                continue
        }

        return this.findFilename(stop_filenames, path.join(directory, '../'))
    }

}
