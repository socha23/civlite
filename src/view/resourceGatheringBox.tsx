import React from 'react';
import { Box } from './box'
import { GameModel } from '../model/gameModel'
import { ResourceType } from '../model/resources';
import { GatherActionLabels } from './icons';
import { ActionProps, ActionRow, ActionRow3, propsForAction } from './action';
import { ManualResourceGatheringLabels } from './labels';
import { WorkType } from '../model/work';

export type ResourceGatheringProps = {
  actions: ActionProps[]
}

export function resourceGatheringProps(model: GameModel): ResourceGatheringProps {

  const typeLabels = (t: ResourceType.Food | WorkType.Insight | WorkType.Labor)  => ({
    title: ManualResourceGatheringLabels[t].ActionTitle,
    description: ManualResourceGatheringLabels[t].Description,
    buttonLabel: ManualResourceGatheringLabels[t].ButtonTitle,
  })

  return {
    actions: [
      propsForAction(model, model.resources.resource(ResourceType.Food).gatherAction, typeLabels(ResourceType.Food)),
      propsForAction(model, model.work.work(WorkType.Labor).gatherAction, typeLabels(WorkType.Labor)),
      propsForAction(model, model.work.work(WorkType.Insight).gatherAction, typeLabels(WorkType.Insight)),
    ]
  }
}

export const ResourceGatheringBox = (p: ResourceGatheringProps) =>
  <Box>
    <div 
    className='dottedDividersParent'
    style={{
      display: "flex",
      flexDirection: "column",
    }}> {
      p.actions.map((a, idx) => <ActionRow3 key={idx} {...a}/>)
    }
    </div>
  </Box>


