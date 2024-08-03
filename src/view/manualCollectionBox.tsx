import React from 'react';
import { Box } from './box'
import { GameModel } from '../model/gameModel'
import { ResourceType } from '../model/resources';
import { ActionProps, ActionRow3, propsForAction } from './action';
import { ManualResourceGatheringLabels } from './labels';
import { WorkType } from '../model/work';
import { ProgressType } from '../model/progress';
import { isWorkNeeded } from '../model/actionsModel';
import { Colors } from './icons';

export type ManualCollectionProps = {
  research?: ActionProps,
  researchNeeded: boolean,
  food?: ActionProps,
  labor?: ActionProps,
}

export function resourceGatheringProps(model: GameModel): ManualCollectionProps {

  const typeLabels = (t: ResourceType.Food | WorkType.Insight | WorkType.Labor) => ({
    title: ManualResourceGatheringLabels[t].ActionTitle,
    //description: ManualResourceGatheringLabels[t].Description,
    buttonLabel: ManualResourceGatheringLabels[t].ButtonTitle,
  })
  const result: ManualCollectionProps = {
    researchNeeded: isWorkNeeded(WorkType.Insight)
  }

  if (model.progress.ManualResearch) {
    result.research = propsForAction(model, model.manualCollection.collectInsight, typeLabels(WorkType.Insight))
  }
  if (model.progress.ManualFood) {
    result.food = propsForAction(model, model.manualCollection.collectFood, typeLabels(ResourceType.Food))
  }
  if (model.progress.ManualLabor) {
    result.labor = propsForAction(model, model.manualCollection.collectLabor, typeLabels(WorkType.Labor))

  }
  return result
}

export const ManualCollectionBox = (p: ManualCollectionProps) =>
  <Box>
    <div
      className='dottedDividersParent'
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        marginTop: 4,
        marginBottom: 4,
      }}> 
      {
        p.research && <ActionRow3 displayRewards={true} {...p.research}>
          {!p.researchNeeded && <div style={{color: Colors.Warning}}>
              {ManualResourceGatheringLabels.NoInsightNeeded}
            </div>}
        </ActionRow3>
      }
      {p.food && <ActionRow3 {...p.food} displayRewards={true}/>}
      {p.labor && <ActionRow3 {...p.labor} displayRewards={true}/>}
    </div>
  </Box>


