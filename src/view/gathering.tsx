import React from 'react';
import { GameModel } from '../model/gameModel'
import { ActionProps, propsForAction, ActionRow3 } from './action';
import { GatheringLabels, } from './labels';

export type GatheringProps = {
  gatherAction: ActionProps,
}

export function gatheringProps(model: GameModel): GatheringProps {
  return {
    gatherAction: propsForAction(model, model.gathering.gatherAction, GatheringLabels.GatherAction)
  }
}

export const GatheringSection = (p: GatheringProps) => <div style={{
  display: "flex",
  flexDirection: "column",
  gap: 4,
}}>
  <ActionRow3 {...p.gatherAction} displayRewards={true}/>
</div>

