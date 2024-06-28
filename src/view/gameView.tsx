import React from 'react';
import { ActionProps, ActionRow } from './action'
import { GameModel } from '../model/gameModel'
import { PopType } from '../model/pops'
import { InventoryBox, InventoryBoxProps, summaryBoxProps } from './inventoryBox';
import { Colors, FontSizes } from './icons';
import { ResourceGatheringBox, ResourceGatheringProps, resourceGatheringProps } from './resourceGatheringBox';
import { PopBox, PopBoxProps, popBoxProps } from './popBox';
import { MilitaryProps, MilitaryView, militaryProps } from './military';
import { CivilizationsView, CivsProps, civsProps } from './civs';
import { BattleProps, BattleView, battleProps } from './battle';


export type GameViewProps = {
  civName: string,
  tick: number
  summary: InventoryBoxProps
  reset: ActionProps
  pops: PopBoxProps[]
  resourceGathering: ResourceGatheringProps,
  military: MilitaryProps,
  civilizations: CivsProps,
  testBattle: BattleProps,
}

export function gameViewProps(model: GameModel, onReset: () => void): GameViewProps {
  return {
    civName: model.civName,
    tick: model.tick,
    summary: summaryBoxProps(model),
    pops: model.population.pops.map(p => popBoxProps(model, p.type)),
    resourceGathering: resourceGatheringProps(model),
    reset: {
      title: "Reset",
      costs: [],
      action: onReset
    },
    military: militaryProps(model),
    civilizations: civsProps(model),
    testBattle: battleProps(model),
  }
}

export const CivName = (p: {civName: string}) => <div style={{
  fontSize: FontSizes.xbig,
  color: Colors.captions,
}}>{p.civName}</div>


const PopColums = {
  [PopType.Idler]: 0,
  [PopType.Gatherer]: 1,
  [PopType.Laborer]: 1,
  [PopType.Herder]: 1,
  [PopType.Farmer]: 1,
  [PopType.Brave]: 2,
  [PopType.Slinger]: 2,
}

export const PopsView = (p: {pops: PopBoxProps[], column: number}) => <div style={{
  display: "flex",
  flexDirection: "column",
}}>
    {p.pops
      .filter(pop => PopColums[pop.popType] === p.column)
      .map((pop, idx) => <PopBox key={idx} {...pop}/>)}
</div>

export const GameView = (p: GameViewProps) =>
  <div style={{
    display: "flex",
    padding: 10,
    fontSize: FontSizes.small,
    color: Colors.default,
  }}>
    <div style={{
      display: "flex",
      flexDirection: "column",
    }}>
      <CivName civName={p.civName}/>
      <div style={{
        display: "flex",
        gap: 20,
      }}>
        <div className="dividersParent" style={{
          display: "flex",
          flexDirection: "column",
          paddingTop: 4,
        }}>
          <InventoryBox {...p.summary}/>
          <ResourceGatheringBox {...p.resourceGathering}/>
          <PopsView pops={p.pops} column={0}/>
          <ActionRow {...p.reset}/>

        </div>
        <PopsView pops={p.pops} column={1}/>
        <div className='dividersParent'>
          <PopsView pops={p.pops} column={2}/>
          <MilitaryView {...p.military}/>
          <BattleView {...p.testBattle}/>
        </div>
        <div>
          <CivilizationsView {...p.civilizations}/>
        </div>
      </div>
    </div>
  </div>

