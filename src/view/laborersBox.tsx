import React from 'react';
import { Box } from './box'
import { GameModel } from '../model/gameModel'
import { PopTypes } from '../model/popModel';
import { ActionButton, ActionProps, propsForAction } from './action';

export type LaborersBoxProps = {
  laborersCount: number,
  laborAction: ActionProps,
  buyLaborerAction: ActionProps,

}

export function laborersBoxProps(model: GameModel): LaborersBoxProps {
  const pop = model.population.pop(PopTypes.Gatherer)
  return {
    laborersCount: pop.count,
    laborAction: propsForAction(model, model.resources.labor.gatherAction, "Labor"),
    buyLaborerAction: propsForAction(model, pop.buyAction, "Promote new laborer")
  }
}

export const LaborersBox = (p: LaborersBoxProps) =>
  <Box>
    <div>
      <ActionButton {...p.laborAction}/>
    </div>
    <div>
      Laborers: {p.laborersCount} 
    </div>
    <div>
      <ActionButton {...p.buyLaborerAction}/>
    </div>
  </Box>


