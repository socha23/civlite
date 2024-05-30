import React from 'react';
import { ActionProps, ActionButton } from './action'
import { GameModel } from '../model/gameModel'
import { LaborersBox, LaborersBoxProps, laborersBoxProps } from './laborersBox';
import { GatherersBox, GatherersBoxProps, gatherersBoxProps } from './gatherersBox';
import { FoodBox, FoodBoxProps, foodBoxProps } from './foodBox';

export type GameViewProps = {
  tick: number
  reset: ActionProps
  food: FoodBoxProps
  gatherers: GatherersBoxProps
  laborers: LaborersBoxProps
}

export function gameViewProps(model: GameModel, onReset: () => void): GameViewProps {
  return {
    tick: model.tick,
    food: foodBoxProps(model),
    gatherers: gatherersBoxProps(model),
    laborers: laborersBoxProps(model),
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
    <LaborersBox {...p.laborers}/>
    <ActionButton {...p.reset} />
  </div>
