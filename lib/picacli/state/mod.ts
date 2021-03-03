export interface Stater {
    set(key: string, value: string | number): void
    get(key: string): string | undefined
    commit(): Promise<void>
    rollback(): Promise<void>
}
