import React, {PropsWithChildren} from 'react';
import { ActionProps, ActionRow, ActionRow3 } from './action'
import { GameModel } from '../model/gameModel'
import { PopType } from '../model/pops'
import { InventoryBox, InventoryBoxProps, summaryBoxProps } from './inventoryBox';
import { Colors, FontSizes } from './icons';
import { ResourceGatheringBox, ResourceGatheringProps, resourceGatheringProps } from './resourceGatheringBox';
import { PopBox, PopBoxProps, popBoxProps } from './popBox';
import { MilitaryProps, MilitaryView, militaryProps } from './military';
import { CivilizationsView, CivsProps, civsProps } from './civs';
import { ActionState } from '../model/action';
import { CalendarBox, CalendarProps, calendarProps } from './calendarBox';
import { HuntingProps, HuntingSection, huntingProps } from './hunting';


export type GameViewProps = {
  civName: string,
  tick: number
  summary: InventoryBoxProps
  reset: ActionProps
  pops: PopBoxProps[]
  resourceGathering: ResourceGatheringProps,
  military: MilitaryProps,
  civilizations: CivsProps,
  calendar: CalendarProps,
  hunting: HuntingProps,
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
      action: onReset,
      state: ActionState.Ready
    },
    military: militaryProps(model),
    civilizations: civsProps(model),
    calendar: calendarProps(model),
    hunting: huntingProps(model),
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


const Column = (p: PropsWithChildren) => <div className="dividersParent" style={{
  display: "flex",
  flexDirection: "column",
  gap: 4,
}}>
  {p.children}
</div>


function popProps(p: GameViewProps, t: PopType) {
  return p.pops.find(pop => pop.popType === t)!!
}

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
        <Column>
          <InventoryBox {...p.summary}/>
          <CalendarBox {...p.calendar}/>
          <ResourceGatheringBox {...p.resourceGathering}/>     
          <PopBox {...popProps(p, PopType.Idler)}/>
          <ActionRow3 {...p.reset}/>
        </Column>
        <Column>
          <PopBox {...popProps(p, PopType.Gatherer)}>
            <HuntingSection {...p.hunting}/>
          </PopBox>
          <PopBox {...popProps(p, PopType.Herder)}/>
          <PopBox {...popProps(p, PopType.Farmer)}/>
        </Column>
        <Column>
          <PopBox {...popProps(p, PopType.Brave)}/>
          <PopBox {...popProps(p, PopType.Slinger)}/>
          <MilitaryView {...p.military}/>
        </Column>
        <Column>
          <CivilizationsView {...p.civilizations}/>
        </Column>
      </div>
    </div>
  </div>

