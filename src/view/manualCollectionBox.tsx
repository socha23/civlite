import React from 'react';
import { Box } from './box'
import { GameModel } from '../model/gameModel'
import { ResourceType } from '../model/resources';
import { ActionProps, ActionRow3, propsForAction } from './action';
import { ManualResourceGatheringLabels } from './labels';
import { WorkType } from '../model/work';
import { ProgressType } from '../model/progress';

export type ManualCollectionProps = {
  actions: ActionProps[],
}

export function resourceGatheringProps(model: GameModel): ManualCollectionProps {

  const typeLabels = (t: ResourceType.Food | WorkType.Insight | WorkType.Labor) => ({
    title: ManualResourceGatheringLabels[t].ActionTitle,
    description: ManualResourceGatheringLabels[t].Description,
    buttonLabel: ManualResourceGatheringLabels[t].ButtonTitle,
  })

  const actions = []
  if (model.progress.ManualResearch) {
    actions.push(propsForAction(model, model.manualCollection.collectInsight, typeLabels(WorkType.Insight)))
  }
  if (model.progress.ManualFood) {
    actions.push(propsForAction(model, model.manualCollection.collectFood, typeLabels(ResourceType.Food)))
  }
  if (model.progress.ManualLabor) {
    actions.push(propsForAction(model, model.manualCollection.collectLabor, typeLabels(WorkType.Labor)))

  }
  return {
    actions: actions
  }
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
      }}> {
        p.actions.map((a, idx) => <ActionRow3 key={idx} {...a} displayRewards={true}/>)
      }
    </div>
  </Box>


