import React from 'react';
import {TestBox, TestBoxProps, testBoxProps} from './testBox'
import {ActionProps, ActionButton} from './action'
import {GameModel} from '../model/gameModel'

export type GameViewProps = {
  tick: number
  test: TestBoxProps
  reset: ActionProps
}

export function gameViewProps(model: GameModel, onReset: () => void): GameViewProps {
  return {
    tick: model.tick,
    test: testBoxProps(model.test),
    reset: {
      title: "Reset",
      action: onReset
    }
  }
}


export const GameView = ({tick, test, reset}: GameViewProps) =>
  <div>
    TICK: {tick}
    <TestBox {...test}/>
    <ActionButton {...reset}/>
  </div>
