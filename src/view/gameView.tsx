import React from 'react';
import { ActionProps, ActionButton } from './action'
import { GameModel } from '../model/gameModel'
import { SummaryBox, SummaryBoxProps, summaryBoxProps } from './summaryBox';
import { Colors, FontSizes } from './icons';
import { ResourceGatheringBox, ResourceGatheringProps, resourceGatheringProps } from './resourceGatheringBox';
import { PopBox, PopBoxProps, popBoxProps } from './popBox';


export type GameViewProps = {
  civName: string,
  tick: number
  summary: SummaryBoxProps
  reset: ActionProps
  pops: PopBoxProps[]
  resourceGathering: ResourceGatheringProps,
}

export function gameViewProps(model: GameModel, onReset: () => void): GameViewProps {
  return {
    civName: model.civName,
    tick: model.tick,
    summary: summaryBoxProps(model),
    pops: model.population.pops.map(p => popBoxProps(model, p.type)),
    resourceGathering: resourceGatheringProps(model),
    reset: {
      title: "Reset",
      costs: [],
      action: onReset
    },
  }
}

export const GameView = (p: GameViewProps) =>
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
      <SummaryBox {...p.summary}/>
      <div>
        {p.pops.map((pop, idx) => <PopBox key={idx} {...pop}/>)}
      </div>
      <ResourceGatheringBox {...p.resourceGathering}/>
      <ActionButton {...p.reset} />
    </div>
  </div>
