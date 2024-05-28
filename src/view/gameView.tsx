import React from 'react';
import { TestBox, TestBoxProps, testBoxProps } from './testBox'
import { ActionProps, ActionButton } from './action'
import { GameModel } from '../model/gameModel'
import { GatherersBox, GatherersBoxProps, gatherersBoxProps } from './gatherersBox';
import { FoodBox, FoodBoxProps, foodBoxProps } from './foodBox';

export type GameViewProps = {
  tick: number
  test: TestBoxProps
  reset: ActionProps
  food: FoodBoxProps
  gatherers: GatherersBoxProps
}

export function gameViewProps(model: GameModel, onReset: () => void): GameViewProps {
  return {
    tick: model.tick,
    test: testBoxProps(model.test),
    food: foodBoxProps(model),
    gatherers: gatherersBoxProps(model),
    reset: {
      title: "Reset",
      action: onReset
    },
  }
}


export const GameView = (p: GameViewProps) =>
  <div>
    <FoodBox {...p.food}/>
    <GatherersBox {...p.gatherers}/>

    <TestBox {...p.test} />
    <ActionButton {...p.reset} />
  </div>
