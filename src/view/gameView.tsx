import React from 'react';
import { ActionProps, ActionButton } from './action'
import { GameModel } from '../model/gameModel'
import { GatherersBox, GatherersBoxProps, gatherersBoxProps } from './gatherersBox';
import { FoodBox, FoodBoxProps, foodBoxProps } from './foodBox';

export type GameViewProps = {
  tick: number
  reset: ActionProps
  food: FoodBoxProps
  gatherers: GatherersBoxProps
}

export function gameViewProps(model: GameModel, onReset: () => void): GameViewProps {
  return {
    tick: model.tick,
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
    <ActionButton {...p.reset} />
  </div>
