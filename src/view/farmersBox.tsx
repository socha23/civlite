import React from 'react';
import { Box } from './box'
import { GameModel } from '../model/gameModel'
import { ActionButton, ActionProps, propsForAction } from './action';
import { PopType } from '../model/pops';

export type FarmersBoxProps = {
  count: number,
  buyAction: ActionProps,

}

export function farmersBoxProps(model: GameModel): FarmersBoxProps {
  const pop = model.population.pop(PopType.Farmer)
  return {
    count: pop.count,
    buyAction: propsForAction(model, pop.buyAction, "Promote Farmer")
  }
}

export const FarmersBox = (p: FarmersBoxProps) =>
  <Box>
    <div>
      Farmers: {p.count} 
    </div>
    <div>
      <ActionButton {...p.buyAction}/>
    </div>
  </Box>


