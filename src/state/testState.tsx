export interface TestState {
  counter: number
}

export function initTestState(): TestState {
  return {counter: 0}
}
