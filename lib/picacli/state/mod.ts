export type StateValue = string | number | undefined
export type StateKey = string

export interface Stater {
    set(key: StateKey, value: StateValue): void
    get(key: StateKey): StateValue
    commit(): Promise<void>
    rollback(): Promise<void>
}
