import React, { ReactElement, ReactNode } from 'react';
import { GameModel } from '../model/gameModel'
import { ActionProps, propsForAction, ActionRow3, AutostartSection } from './action';
import { GatheringLabels, popLabelPlural, } from './labels';
import { GatheringActionStats } from '../model/gatheringModel';
import { Colors, Icons, Labels } from './icons';
import { CalendarLabels } from './calendarLabels';
import { PopType } from '../model/pops';
import { ResourceType } from '../model/resources';
import { WorkType } from '../model/work';
import { PercentageModifier } from './amount';
import { ProgressType } from '../model/progress';

export type GatheringProps = {
  gatherAction: ActionProps,
  gatherStats: GatheringActionStats,
  progress: ProgressType,
}

export function gatheringProps(model: GameModel): GatheringProps {
  return {
    gatherAction: propsForAction(model, model.gathering.gatherAction, GatheringLabels.GatherAction),
    gatherStats: model.gathering.gatheringStats,
    progress: model.progress,
  }
}

const GatheringStats = (p: GatheringActionStats) => <div style={{
  marginLeft: 4,
  display: "grid",
  rowGap: 4,
  columnGap: 20,
  justifyContent: "start",
  gridTemplateColumns: "auto auto auto",
}}>
  <div style={{textAlign: "right"}}>{GatheringLabels.GathereringBase}</div>
  <div>{p.uncappedFood}</div>
  <div>{p.totalWork} <i className={Icons[WorkType.Gathering]}/> / {p.workPerFood}</div>
  
  <div style={{textAlign: "right"}}>{GatheringLabels.ForestCap}</div>
  <div style={{color: p.forestCap < p.uncappedFood ? Colors.Warning : Colors.default}}>{p.forestCap}</div>    
  <div>{p.forestCount} <i className={Icons[ResourceType.Forest]}/> * {p.forestCapPerForest}</div>    
    
  

  <div style={{textAlign: "right"}}>{GatheringLabels.SeasonalMultiplier}</div>
  <div><PercentageModifier value={p.seasonalMultiplier}/></div>
  <div>{CalendarLabels[p.season]}</div>

  <div style={{textAlign: "right"}}>{GatheringLabels.TotalFood}</div>
  <div>{p.totalFood}</div>



</div>

export const GatheringSection = (p: GatheringProps) => <div style={{
  display: "flex",
  flexDirection: "column",
  gap: 4,
}}>
  <GatheringStats {...p.gatherStats}/>
  {
    p.progress.GatheringAutomationEnabled && <AutostartSection {...p.gatherAction}>
    <div style={{
      width: 160
    }}>
    {GatheringLabels.AutomateGathering}
    </div>
  </AutostartSection>
  }
  <ActionRow3 {...p.gatherAction} displayRewards={true}/>
</div>

