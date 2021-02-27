export interface Stater {
    open(project: string): void
    set(key: string, value: string): void
    get(key: string): string | undefined
    commit(): void

    close(): void
}
