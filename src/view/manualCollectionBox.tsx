import React from 'react';
import { Box } from './box'
import { GameModel } from '../model/gameModel'
import { ResourceType } from '../model/resources';
import { ActionProps, ActionRow3, propsForAction } from './action';
import { ManualResourceGatheringLabels } from './labels';
import { WorkType } from '../model/work';

export type ManualCollectionProps = {
  actions: ActionProps[]
}

export function resourceGatheringProps(model: GameModel): ManualCollectionProps {

  const typeLabels = (t: ResourceType.Food | WorkType.Insight | WorkType.Labor)  => ({
    title: ManualResourceGatheringLabels[t].ActionTitle,
    description: ManualResourceGatheringLabels[t].Description,
    buttonLabel: ManualResourceGatheringLabels[t].ButtonTitle,
  })

  return {
    actions: [
      propsForAction(model, model.manualCollection.collectFood, typeLabels(ResourceType.Food)),
      propsForAction(model, model.manualCollection.collectLabor, typeLabels(WorkType.Labor)),
      propsForAction(model, model.manualCollection.collectInsight, typeLabels(WorkType.Insight)),
    ]
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
      p.actions.map((a, idx) => <ActionRow3 key={idx} {...a}/>)
    }
    </div>
  </Box>


