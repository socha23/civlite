import React from 'react';
import { FontSizes, Icons, Labels, BattleLabels, BattleLongDescription } from './icons';
import { WarType } from '../model/wars';
import { War, WarState } from '../model/warModel';
import { ActionButton, ActionProps, propsForAction } from './action';
import { GameModel } from '../model/gameModel';
import { PopType } from '../model/pops';
import { InclusiveIntRange } from '../model/utils';
import { Battle } from '../model/battleModel';
import { ResourceType } from '../model/resources';

type ExpectedProps = {
  type: PopType | ResourceType
  range: InclusiveIntRange
}

export type WarProps = {
  expectedOpposition: ExpectedProps[]
  expectedRewards: ExpectedProps[]
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
    expectedOpposition: war.expectedOpposition,
    expectedRewards: war.expectedRewards,
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
  flexDirection: "column",
}}>
  <div>
    <BattleLabels.MarchTime time={p.marchAction.timeoutLeft || p.marchAction.timeout || 0}/>

  </div>
  <div style={{
    marginTop: 4,
    display: "flex",
    gap: 4,
    marginBottom: 4,
  }}>
    <div style={{
      width: 120,
    }}>
      <ActionButton {...p.marchAction}/>
    </div>
    {(p.state === WarState.BeforeMarch) && 
      <div style={{width: 100}}>  
        <ActionButton {...p.cancelAction}/>
      </div>
    }

  </div>
</div>

const WarReturned = (p: WarProps) => <div style={{
  display: "flex",
}}>
  <div>
    <BattleLabels.ArmyReturned army={p.armyTitle}/>
  </div>
  <div>
    <ActionButton {...p.completeAction}/>
  </div>
</div>

const ExpectedRow = (p: {description: string, items: ExpectedProps[]}) => <div style={{
  display: "flex",
  alignItems: "center",
  gap: 4,
}}>
  <div>{p.description}</div>
  <div style={{
    display: "flex"
  }}>
    {p.items.map((i, idx) => <span key={idx} style={{
    }}>
      {i.range.from}-{i.range.to}  
      <i className={Icons[i.type]}/>
    </span>)}
  </div>
</div>

const WarTitle = (p: WarProps) => <div style={{
  fontSize: FontSizes.normal,
  textDecoration: "underline",
}}>
  <BattleLabels.CivBoxTitle goal={p.goal} army={p.armyTitle}/>
</div>

export const WarView = (p: WarProps) => <div style={{
  display: "flex",
  flexDirection: "column"
}}>
  <WarTitle {...p}/>
  <div style={{
    paddingTop: 4,
    paddingBottom: 4,
  }}>
      <BattleLongDescription {...p}/>
  </div>
  <ExpectedRow description={BattleLabels.ExpectedOpposition} items={p.expectedOpposition}/>
  {
    (p.expectedRewards.length > 0) && 
      <ExpectedRow description={BattleLabels.ExpectedReward} items={p.expectedRewards}/>

  }
  
  
  {
    (p.state === WarState.BeforeMarch || p.state === WarState.March) && <WarBeforeMarchAndMarching {...p}/>
  }
  {
    (p.state === WarState.Returned) && <WarReturned {...p}/>
  }

</div>



