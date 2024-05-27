import React from 'react';
import {TestBox, TestBoxProps} from './testBox'
import {ActionProps, ActionButton} from './action'

export type GameViewProps = {
  tick: number
  test: TestBoxProps
  reset: ActionProps
}

export const GameView = ({tick, test, reset}: GameViewProps) =>
  <div>
    TICK: {tick}
    <TestBox {...test}/>
    <ActionButton {...reset}/>
  </div>
