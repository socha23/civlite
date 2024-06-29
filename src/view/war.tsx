import React from 'react';
import { FontSizes, Icons, Labels, BattleLabels } from './icons';
import { WarType } from '../model/wars';
import { War, WarState } from '../model/warModel';
import { ActionButton, ActionProps, propsForAction } from './action';
import { GameModel } from '../model/gameModel';

export type WarProps = {
  goal: WarType
  state: WarState
  marchAction: ActionProps
  cancelAction: ActionProps
  completeAction: ActionProps
  armyTitle: string
  againstTitle: string
  againstColor: string 
}

export function warProps(model: GameModel, war: War): WarProps {
  return {
    goal: war.goal,
    state: war.state,
    armyTitle: war.army.title,
    againstTitle: war.against.title,
    againstColor: "#000",
    marchAction: propsForAction(model, war.marchAction, {
      title: BattleLabels.March,
    }),
    cancelAction: propsForAction(model, war.cancelAction, {
      title: BattleLabels.Cancel,
    }),
    completeAction: propsForAction(model, war.completeAction, {
      title: BattleLabels.Complete,
    }),
    }
}

export const WarBeforeMarchAndMarching = (p: WarProps) => <div style={{
  display: "flex",
}}>
  <div>
    <ActionButton {...p.marchAction}/>
  </div>
  {(p.state === WarState.BeforeMarch) && 
    <div>  
      <ActionButton {...p.cancelAction}/>
    </div>
  }
</div>

export const WarReturned = (p: WarProps) => <div style={{
  display: "flex",
}}>
  <div>
    <BattleLabels.ArmyReturned army={p.armyTitle}/>
  </div>
  <div>
    <ActionButton {...p.completeAction}/>
  </div>
</div>


export const WarTitle = (p: WarProps) => <div style={{
  fontSize: FontSizes.normal,
}}>
  <BattleLabels.CivBoxTitle goal={p.goal} army={p.armyTitle}/>
</div>

export const WarView = (p: WarProps) => <div style={{
  display: "flex",
  flexDirection: "column"
}}>
  <WarTitle {...p}/>
  {
    (p.state === WarState.BeforeMarch || p.state === WarState.March) && <WarBeforeMarchAndMarching {...p}/>
  }
  {
    (p.state === WarState.Returned) && <WarReturned {...p}/>
  }

</div>



