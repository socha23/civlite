import React from 'react';
import { Box } from './box'
import { GameModel } from '../model/gameModel'
import { ActionButton, ActionProps, propsForAction } from './action';
import { PopType } from '../model/pops';

export type LaborersBoxProps = {
  labor: number,
  laborersCount: number,
  laborAction: ActionProps,
  buyLaborerAction: ActionProps,

}

export function laborersBoxProps(model: GameModel): LaborersBoxProps {
  const pop = model.population.pop(PopType.Laborer)
  return {
    labor: model.resources.labor.count,
    laborersCount: pop.count,
    laborAction: propsForAction(model, model.resources.labor.gatherAction, "Labor"),
    buyLaborerAction: propsForAction(model, pop.buyAction, "Promote Laborer")
  }
}

export const LaborersBox = (p: LaborersBoxProps) =>
  <Box>
    <div>
      Labor: {p.labor.toFixed()}
    </div>
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


