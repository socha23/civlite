import React from 'react';
import { ActionProps, ActionButton } from './action'
import { GameModel } from '../model/gameModel'
import { FoodBox, FoodBoxProps, foodBoxProps } from './foodBox';
import { GatherersBox, GatherersBoxProps, gatherersBoxProps } from './gatherersBox';
import { LaborersBox, LaborersBoxProps, laborersBoxProps } from './laborersBox';
import { FarmersBox, FarmersBoxProps, farmersBoxProps } from './farmersBox';


export type GameViewProps = {
  tick: number
  reset: ActionProps
  food: FoodBoxProps
  gatherers: GatherersBoxProps
  laborers: LaborersBoxProps
  farmers: FarmersBoxProps
}

export function gameViewProps(model: GameModel, onReset: () => void): GameViewProps {
  return {
    tick: model.tick,
    food: foodBoxProps(model),
    gatherers: gatherersBoxProps(model),
    laborers: laborersBoxProps(model),
    farmers: farmersBoxProps(model),
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
    <FarmersBox {...p.farmers}/>
    <ActionButton {...p.reset} />
  </div>
