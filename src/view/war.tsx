import React, { ReactNode } from 'react';
import { FontSizes, Icons, Labels, BattleLabels, BattleLongDescription, Colors } from './icons';
import { WarType } from '../model/wars';
import { War, WarState } from '../model/warModel';
import { ActionButton, ActionProps, ActionRow2, propsForAction } from './action';
import { GameModel } from '../model/gameModel';
import { PopType } from '../model/pops';
import { InclusiveIntRange } from '../model/utils';
import { Battle } from '../model/battleModel';
import { ResourceType } from '../model/resources';
import { BattleProps, BattleView, battleProps } from './battle';
import { Amount, amountValueType } from '../model/costs';

type ExpectedProps = {
  popType?: PopType 
  resourceType?: ResourceType
  range: InclusiveIntRange
}

export type WarProps = {
  expectedOpposition: ExpectedProps[]
  expectedRewards: ExpectedProps[]
  rewards: Amount[]
  goal: WarType
  state: WarState
  
  marchAction: ActionProps
  cancelAction: ActionProps
  
  fightAction: ActionProps
  retreatAction: ActionProps
  marchBackHomeAction: ActionProps
  
  completeAction: ActionProps


  armyTitle: string
  againstTitle: string
  againstColor: string 
  currentBattle?: BattleProps
}

export function warProps(model: GameModel, war: War): WarProps {
  return {
    goal: war.goal,
    state: war.state,
    currentBattle: war.currentBattle ? battleProps(model, war.currentBattle) : undefined,
    expectedOpposition: war.expectedOpposition,
    expectedRewards: war.expectedRewards,
    rewards: war.rewards,
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
    fightAction: propsForAction(model, war.fightAction, {
      title: BattleLabels.Fight,
    }),
    retreatAction: propsForAction(model, war.retreatAction, {
      title: BattleLabels.Retreat,
    }),
    marchBackHomeAction: propsForAction(model, war.marchBackHomeAction, {
      title: BattleLabels.MarchBackHome,
    }),
    }
}


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
      <i className={Icons[amountValueType(i)]}/>
    </span>)}
  </div>
</div>

const ValueRow = (p: {description: string, items: Amount[]}) => <div style={{
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
      {i.count}  
      <i className={Icons[amountValueType(i)]}/>
    </span>)}
  </div>
</div>

const WarTitle = (p: WarProps) => <div style={{
  fontSize: FontSizes.normal,
  textDecoration: "underline",
}}>
  <BattleLabels.CivBoxTitle goal={p.goal} army={p.armyTitle}/>
</div>


const BeforeBattle = (p: WarProps) => <div style={{
  display: "flex",
  flexDirection: "column",
  gap: 4,
}}>
  <div style={{
    paddingTop: 4,
  }}>
      <BattleLongDescription {...p}/>
  </div>
  <ExpectedRow description={BattleLabels.ExpectedOpposition} items={p.expectedOpposition}/>
  {
    (p.expectedRewards.length > 0) && 
      <ExpectedRow description={BattleLabels.ExpectedReward} items={p.expectedRewards}/>
  }
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


const DuringBattle = (p: {war: WarProps, battle: BattleProps}) => <div style={{
  display: "flex",
  flexDirection: "column"
}}>
  {p.war.state === WarState.Battle && 
    <ActionRow2 {...p.war.fightAction}><BattleLabels.ArmyInBattle army={p.war.armyTitle}/></ActionRow2>
  }
  {p.war.state === WarState.AfterBattleAttackerLost && 
    <ActionRow2 {...p.war.retreatAction}><BattleLabels.ArmyLost army={p.war.armyTitle}/></ActionRow2>
  }
  {p.war.state === WarState.AfterBattleAttackerWon && 
    <ActionRow2 {...p.war.marchBackHomeAction}><BattleLabels.ArmyVictorius army={p.war.armyTitle}/></ActionRow2>
  }
  <BattleView {...p.battle}/>
</div>


const AfterBattle = (p: {message: string | ReactNode, action: ActionProps, war: WarProps}) => 
  <ActionRow2 {...p.action}>
    <div style={{
      display: "flex",
      gap: 4,
      flexDirection: "column",
    }}>
      <div>{p.message}</div>
      {p.war.rewards.length > 0 && <ValueRow description={BattleLabels.Reward} items={p.war.rewards} />}
    </div>
  </ActionRow2>


export const WarView = (p: WarProps) => <div style={{
  display: "flex",
  flexDirection: "column",
  borderWidth: 2,
  borderStyle: "solid",
  borderColor: Colors.ActiveWar,
  padding: 4,
  borderRadius: 4,

}}>
  <WarTitle {...p}/>
  {
    (p.state === WarState.BeforeMarch || p.state === WarState.March) && 
    <BeforeBattle {...p}/>
  }
  {
    (p.currentBattle && (p.state === WarState.Battle || p.state === WarState.AfterBattleAttackerLost  || p.state === WarState.AfterBattleAttackerWon)) && 
    <DuringBattle battle={p.currentBattle} war={p}/>
  }
  {p.state === WarState.Retreat && 
    <AfterBattle message={<BattleLabels.ArmyRetreating army={p.armyTitle}/>} action={p.retreatAction} war={p}/>
  }
  {p.state === WarState.MarchBackHome && 
    <AfterBattle message={<BattleLabels.ArmyMarchingBackHome army={p.armyTitle}/>} action={p.marchBackHomeAction} war={p}/>
  }
  {p.state === WarState.Returned && 
    <AfterBattle message={<BattleLabels.ArmyReturned army={p.armyTitle}/>} action={p.completeAction} war={p}/>
  }

</div>



