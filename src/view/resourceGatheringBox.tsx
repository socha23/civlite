import React from 'react';
import { Box } from './box'
import { GameModel } from '../model/gameModel'
import { ResourceType } from '../model/resources';
import { GatherActionLabels } from './icons';
import { ActionProps, ActionRow, propsForAction } from './action';

export type ResourceGatheringProps = {
  actions: ActionProps[]
}

export function resourceGatheringProps(model: GameModel): ResourceGatheringProps {
  
  const gatherableResources = [ResourceType.Food, ResourceType.Labor]

  return {
    actions: gatherableResources.map(t => propsForAction(
      model, model.resources.resource(t).gatherAction, {title: GatherActionLabels[t]}
    ))
  }
}

export const ResourceGatheringBox = (p: ResourceGatheringProps) =>
  <Box>
    <div style={{
      display: "flex",
      flexDirection: "column",
    }}> {
      p.actions.map((a, idx) => <ActionRow key={idx} {...a}/>)
    }
    </div>
  </Box>


