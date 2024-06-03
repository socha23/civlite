import React from 'react';
import { Box } from './box'
import { GameModel } from '../model/gameModel'
import { ActionButton, ActionProps, propsForAction } from './action';
import { PopType } from '../model/pops';

export type GatherersBoxProps = {
  gatherersCount: number,
  gatherFoodAction: ActionProps,
  buyGathererAction: ActionProps,

}

export function gatherersBoxProps(model: GameModel): GatherersBoxProps {
  const pop = model.population.pop(PopType.Gatherer)
  return {
    gatherersCount: pop.count,
    gatherFoodAction: propsForAction(model, model.resources.food.gatherAction, "Gather Food"),
    buyGathererAction: propsForAction(model, pop.buyAction, "Add Gatherer")
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


