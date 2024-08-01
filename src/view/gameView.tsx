import React, {PropsWithChildren, useEffect, useRef} from 'react';
import { ActionProps, ActionRow3 } from './action'
import { GameModel } from '../model/gameModel'
import { PopType } from '../model/pops'
import { InventoryBox, InventoryBoxProps, summaryBoxProps } from './inventoryBox';
import { Colors, FontSizes, Labels, MainLabels } from './icons';
import { ManualCollectionBox, ManualCollectionProps, resourceGatheringProps } from './manualCollectionBox';
import { PopBox, PopBoxProps, popBoxProps } from './popBox';
import { MilitaryProps, MilitaryView, militaryProps } from './military';
import { CivilizationsView, CivsProps, civsProps } from './civs';
import { ActionState } from '../model/action';
import { CalendarBox, CalendarProps, calendarProps } from './calendarBox';
import { HuntingProps, HuntingSection, huntingProps } from './hunting';
import { Effects } from './effects';
import { LogProps, LogView, logProps } from './log';
import { gatheringProps, GatheringProps, GatheringSection } from './gathering';
import { HungerWarning } from './food';
import { TooltipOverlay, WithTooltip } from './tooltips';
import { MouseCatcher } from './mouseCatcher';


export type GameViewProps = {
  log: LogProps,
  civName: string,
  summary: InventoryBoxProps
  reset: ActionProps
  pops: PopBoxProps[]
  resourceGathering: ManualCollectionProps,
  military: MilitaryProps,
  civilizations: CivsProps,
  calendar: CalendarProps,
  hunting: HuntingProps,
  gathering: GatheringProps,

  paused: boolean,
  setPaused: ((t: boolean) => void),
}

export function gameViewProps(model: GameModel, onReset: () => void): GameViewProps {
  return {
    civName: model.civName,
    log: logProps(model.log),
    summary: summaryBoxProps(model),
    pops: model.population.pops.map(p => popBoxProps(model, p.type)),
    resourceGathering: resourceGatheringProps(model),
    reset: {
      id: "reset",
      title: "Reset",
      costs: [],
      action: onReset,
      state: ActionState.Ready
    },
    military: militaryProps(model),
    civilizations: civsProps(model),
    calendar: calendarProps(model),
    hunting: huntingProps(model),
    gathering: gatheringProps(model),

    paused: model.paused,
    setPaused: (p) => {model.paused = p}
  }
}

export const CivName = (p: {civName: string}) => <div style={{
  fontSize: FontSizes.xbig,
  color: Colors.captions,
}}>{p.civName}</div>


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

const PausedIndicator = (p: {paused: boolean}) => <div style={{
  color: Colors.PausedIndicator,
  fontSize: FontSizes.xbig,
}}>
  {p.paused && MainLabels.Paused}

</div>

const InnerGameView = (p: GameViewProps) =>
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
      <div style={{
        display: "flex",
        gap: 20,
        alignItems: "center",
      }}>
        <CivName civName={p.civName}/>
        <PausedIndicator paused={p.paused}/>
      </div>
      <div style={{
        display: "flex",
        gap: 20,
        height: "100%",
      }}>
        <Column>
          <WithTooltip tooltip={<div>BOOO</div>}>
            <InventoryBox {...p.summary}/>
          </WithTooltip>
          <CalendarBox {...p.calendar}/>
          <ManualCollectionBox {...p.resourceGathering}/>     
          <PopBox {...popProps(p, PopType.Idler)}>
            <GatheringSection {...p.gathering}/>
          </PopBox>
          
        </Column>
        <Column>
          <PopBox {...popProps(p, PopType.Hunter)}>
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
        <Column>
          <div style={{flexGrow: 1, maxHeight: 600}}>
            <LogView {...p.log}/>
          </div>
          <HungerWarning {...p.summary.food}/>
        </Column>
      </div>
    </div>
  </div>

export const GameView = (p: GameViewProps) => {

  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (ref.current) {
      ref.current.focus()
    }
  })

  return <div style={{
    position: "relative",
    outline: "none",
  }}
    ref={ref}
    tabIndex={0}
    onKeyDown={e => {
      if (e.key === ' ') {
        p.setPaused(!p.paused)
      }        
    }}
  >
    <Effects/>
    <TooltipOverlay/>
    <div style={{
      zIndex: 0
    }}>
      <MouseCatcher>
        <InnerGameView {...p}/>
      </MouseCatcher>
    </div>
  </div>
  
}
