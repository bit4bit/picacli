export * from './directory.ts'


export interface ProjectPathResolver {
    // directory raiz del projecto
    rootDirectory(stop_at_filenames: string[]): string
}
