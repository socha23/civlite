import React from 'react';
import { Box } from './box'
import { GameModel } from '../model/gameModel'
import { ResourceType } from '../model/resources';
import { GatherActionLabels } from './icons';
import { ActionProps, ActionRow, ActionRow3, propsForAction } from './action';
import { ManualResourceGatheringLabels } from './labels';

export type ResourceGatheringProps = {
  actions: ActionProps[]
}

export function resourceGatheringProps(model: GameModel): ResourceGatheringProps {
  

  type Gatherable = ResourceType.Food | ResourceType.Insight | ResourceType.Labor
  const gatherableResources = [ResourceType.Food, ResourceType.Insight, ResourceType.Labor] as Gatherable[]

  return {
    actions: gatherableResources.map(t => propsForAction(
      model, 
      model.resources.resource(t).gatherAction, 
      {
        title: ManualResourceGatheringLabels[t].ActionTitle,
        description: ManualResourceGatheringLabels[t].Description,
        buttonLabel: ManualResourceGatheringLabels[t].ButtonTitle,
      }
    ))
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


