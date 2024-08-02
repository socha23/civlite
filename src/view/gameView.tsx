import React, { PropsWithChildren, useEffect, useRef } from 'react';
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
import { ResearchSection, researchSectionProps, ResearchSectionProps } from './research';
import { ProgressType } from '../model/progress';
import { GameLost } from './gameLost';
import { CheatsPanel, cheatsProps, CheatsProps } from './cheats';


export type GameViewProps = {
  log: LogProps,

  progress: ProgressType,

  summary: InventoryBoxProps
  reset: ActionProps
  pops: PopBoxProps[]
  resourceGathering: ManualCollectionProps,
  military: MilitaryProps,
  civilizations: CivsProps,
  calendar: CalendarProps,
  hunting: HuntingProps,
  gathering: GatheringProps,
  research: ResearchSectionProps,

  paused: boolean,
  setPaused: ((t: boolean) => void),
  gameLost: boolean,
  cheats: CheatsProps,
}

export function gameViewProps(model: GameModel, onReset: () => void): GameViewProps {
  return {
    progress: model.progress,
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
    research: researchSectionProps(model),

    paused: model.paused,
    setPaused: (p) => { model.paused = p },
    gameLost: model.gameLost,
    cheats: cheatsProps(model),
  }
}

export const CivName = (p: { civName: string }) => <div style={{
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

const PausedIndicator = (p: { paused: boolean }) => <div style={{
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
        paddingBottom: 8,
        alignItems: "center",
      }}>
        <CivName civName={p.progress.CivName} />
        <PausedIndicator paused={p.paused} />
      </div>
      <div style={{
        display: "flex",
        gap: 20,
        height: "100%",
      }}>
        <Column>
          {p.progress.Inventory && <InventoryBox {...p.summary} />}
          {p.progress.Calendar && <CalendarBox {...p.calendar} />}
          {p.progress.ManualCollection && <ManualCollectionBox {...p.resourceGathering} />}
          {p.research.availableResearchActions.length > 0 && <ResearchSection {...p.research} />}
        </Column>
        <Column>
          {p.progress.PopEnabled[PopType.Idler] &&
            <PopBox {...popProps(p, PopType.Idler)}>
              <GatheringSection {...p.gathering} />
            </PopBox>
          }
          {p.progress.PopEnabled[PopType.Hunter] &&
            <PopBox {...popProps(p, PopType.Hunter)}>
              <HuntingSection {...p.hunting} />
            </PopBox>
          }
          {p.progress.PopEnabled[PopType.Herder] &&
            <PopBox {...popProps(p, PopType.Herder)} />}
          {p.progress.PopEnabled[PopType.Farmer] &&
            <PopBox {...popProps(p, PopType.Farmer)} />}
        </Column>
        <Column>
          {p.progress.PopEnabled[PopType.Brave] &&
            <PopBox {...popProps(p, PopType.Brave)} />}
          {p.progress.PopEnabled[PopType.Slinger] &&
            <PopBox {...popProps(p, PopType.Slinger)} />}
          {p.progress.Military &&
            <MilitaryView {...p.military} />
          }
        </Column>
        <Column>
          <CivilizationsView {...p.civilizations} />
        </Column>
        <Column>
          {p.progress.Log &&

            <div style={{ flexGrow: 1, maxHeight: 300 }}>
              <LogView {...p.log} />
            </div>
          }
          {p.summary.food.expectedHungerDeaths.length > 0 && <HungerWarning {...p.summary.food} />}
          
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
    width: "100%",
    height: "100%",
    outline: "none",
    userSelect: "none",
  }}
    ref={ref}
    tabIndex={0}
    onKeyDown={e => {
      if (e.key === ' ') {
        p.setPaused(!p.paused)
      }
    }}
  >
    {p.gameLost && <GameLost reset={p.reset}/>}
    <Effects />
    <TooltipOverlay />
    <div style={{
      width: "100%",
      height: "100%",
      zIndex: 0
    }}>
      <MouseCatcher>
        <div style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}>
          <div style={{
            flexGrow: 1,
          }}>
            <InnerGameView {...p} />
          </div>
          <CheatsPanel {...p.cheats}/>
        </div>
      </MouseCatcher>
    </div>
  </div>

}
