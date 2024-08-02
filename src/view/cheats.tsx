import React from 'react';
import { GameModel } from '../model/gameModel'
import { ActionButton3, ActionProps, propsForAction } from './action';
import { FontSizes } from './icons';

export type CheatsProps = {
  cheatActions: ActionProps[]
}

export function cheatsProps(model: GameModel): CheatsProps {

  return {
    cheatActions: model.cheats.applyCheatsActions.map(a => propsForAction(model, a, {
      buttonLabel: "Cheat: " + a.id
    }))
  }  
}

export const CheatsPanel = (p: CheatsProps) => <div style={{
  display: "flex",
  gap: 4,
  padding: 4,
  fontSize: FontSizes.normal,
}}>
  {p.cheatActions.map(a => <ActionButton3 {...a} style={{
    padding: 4,
    }}/>)}
</div>
