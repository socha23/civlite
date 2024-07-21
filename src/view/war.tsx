import React, { ReactNode } from 'react';
import { FontSizes, BattleLabels, BattleLongDescription, Colors } from './icons';
import { WarType } from '../model/wars';
import { War, WarState } from '../model/warModel';
import { ActionButton, ActionProps, ActionRow2, propsForAction } from './action';
import { GameModel } from '../model/gameModel';
import { BattleProps, BattleView, battleProps } from './battle';
import { Amount, ExpectedAmount, ExpectedPopAmount } from '../model/amount';
import { Amounts } from './amount';

export type WarProps = {
  expectedOpposition: ExpectedPopAmount[]
  expectedRewards: ExpectedAmount[]
  rewards: Amount[]
  goal: WarType
  state: WarState

  actions: {
    march: ActionProps
    cancel: ActionProps
    fight: ActionProps
    retreat: ActionProps
    marchBackHome: ActionProps
    complete: ActionProps 
  }
  
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
    actions: {
      march: propsForAction(model, war.actions.march, {title: BattleLabels.March}),
      cancel: propsForAction(model, war.actions.cancel, {title: BattleLabels.Cancel}),
      fight: propsForAction(model, war.actions.fight, {title: BattleLabels.Fight}),
      retreat: propsForAction(model, war.actions.retreat, {title: BattleLabels.Retreat}),
      marchBackHome: propsForAction(model, war.actions.marchBackHome, {title: BattleLabels.MarchBackHome}),
      complete: propsForAction(model, war.actions.complete, {title: BattleLabels.Complete}),
    }
  }
}

const WarTitle = (p: WarProps) => <div style={{
  fontSize: FontSizes.normal,
  textDecoration: "underline",
}}>
  <BattleLabels.CivBoxTitle goal={p.goal} army={p.armyTitle}/>
</div>


const ValueRow = (p: {description: string, items: (ExpectedAmount | Amount)[]}) => <div style={{
  display: "flex",
  alignItems: "center",
  gap: 4,
}}>
  <div>{p.description}</div>
  <Amounts items={p.items}/>
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
  <ValueRow description={BattleLabels.ExpectedOpposition} items={p.expectedOpposition}/>
  {
    (p.expectedRewards.length > 0) && 
      <ValueRow description={BattleLabels.ExpectedReward} items={p.expectedRewards}/>
  }
  <div>
    <BattleLabels.MarchTime time={/*p.actions.march.timeoutLeft || p.actions.march.timeout || */0}/>
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
      <ActionButton {...p.actions.march}/>
    </div>
    {(p.state === WarState.BeforeMarch) && 
      <div style={{width: 100}}>  
        <ActionButton {...p.actions.cancel}/>
      </div>
    }
  </div>
</div>


const DuringBattle = (p: {war: WarProps, battle: BattleProps}) => <div style={{
  display: "flex",
  flexDirection: "column"
}}>
  {p.war.state === WarState.Battle && 
    <ActionRow2 {...p.war.actions.fight}><BattleLabels.ArmyInBattle army={p.war.armyTitle}/></ActionRow2>
  }
  {p.war.state === WarState.AfterBattleAttackerLost && 
    <ActionRow2 {...p.war.actions.retreat}><BattleLabels.ArmyLost army={p.war.armyTitle}/></ActionRow2>
  }
  {p.war.state === WarState.AfterBattleAttackerWon && 
    <ActionRow2 {...p.war.actions.marchBackHome}><BattleLabels.ArmyVictorius army={p.war.armyTitle}/></ActionRow2>
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
    <AfterBattle message={<BattleLabels.ArmyRetreating army={p.armyTitle}/>} action={p.actions.retreat} war={p}/>
  }
  {p.state === WarState.MarchBackHome && 
    <AfterBattle message={<BattleLabels.ArmyMarchingBackHome army={p.armyTitle}/>} action={p.actions.marchBackHome} war={p}/>
  }
  {p.state === WarState.Returned && 
    <AfterBattle message={<BattleLabels.ArmyReturned army={p.armyTitle}/>} action={p.actions.complete} war={p}/>
  }
</div>
