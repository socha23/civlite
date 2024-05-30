import React from 'react';
import { Box } from './box'
import { GameModel, PopTypes } from '../model/gameModel'
import { ActionButton, ActionProps, propsForAction } from './action';

export type GatherersBoxProps = {
  gatherersCount: number,
  gatherFoodAction: ActionProps,
  buyGathererAction: ActionProps,

}

export function gatherersBoxProps(model: GameModel): GatherersBoxProps {
  return {
    gatherersCount: model.population.pop(PopTypes.Gatherer).count,
    gatherFoodAction: propsForAction(model.actions.gatherFood, "Gather Food"),
    buyGathererAction: propsForAction(model.population.buyPopAction(PopTypes.Gatherer), "Add Gatherer")
  }
}

export const GatherersBox = (p: GatherersBoxProps) =>
  <Box>
    <div>
      <ActionButton {...p.gatherFoodAction}/>
    </div>
    <div>
      Gatherers: {p.gatherersCount} 
    </div>
    <div>
      <ActionButton {...p.buyGathererAction}/>
    </div>
  </Box>


