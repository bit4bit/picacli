export type StateValue = string | number
export type StateKey = string

export interface Stater {
    set(key: StateKey, value: StateValue): void
    get(key: StateKey): StateValue
    has(key: StateKey): boolean
    commit(): Promise<void>
    rollback(): Promise<void>
}
