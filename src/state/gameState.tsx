import {TestState, initTestState} from './testState'

export interface GameState {
  tick: number
  test: TestState
}

export function initGameState(): GameState {
  return {
    tick: 0,
    test: initTestState(),
  }
}
