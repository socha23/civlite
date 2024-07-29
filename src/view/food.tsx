import React from 'react';
import { GameModel } from '../model/gameModel'
import { FoodLabels, } from './labels';
import { PopType } from '../model/pops';
import { ResourceType } from '../model/resources';
import { LinePanel } from './linePanel';
import { FontSizes, Icons, Labels } from './icons';

export type FoodProps = {
  foodCount: number,
  foodCap: number,
  expectedConsumption: {
    type: PopType,
    count: number,
  }[]
}

export function foodProps(model: GameModel): FoodProps {
  const food = model.resources.resource(ResourceType.Food)
  return {
    foodCount: food.count,
    foodCap: food.cap || 0,
    expectedConsumption: model.hunger.foodConsumptionPerSeason,
  }
}

const FoodDetails = (p: FoodProps) => <div style={{
  display: "flex",
  flexDirection: "column",
  gap: 2,
  paddingTop: 4,
  paddingLeft: 24,
  fontSize: FontSizes.small,
}}>
  <div>{FoodLabels.FoodConsumptionPerSeason}</div>
  <div style={{
    display: "grid",
    justifyContent: "start",
    columnGap: 20,
  }}>
    {p.expectedConsumption.map((p, idx) => <React.Fragment key={p.type}>
      <div style={{
        gridRow: idx,
        gridColumn: 1
      }}>{Labels.Plural[p.type]}</div>
      <div style={{
        gridRow: idx,
        gridColumn: 2
      }}>{p.count}</div>
    </React.Fragment>)}
  </div>
</div>

export const FoodLinePanel = (p: FoodProps) => <LinePanel
  icon={Icons[ResourceType.Food]}
  label={Labels[ResourceType.Food]}
  value={p.foodCount}
  postfix={<div>/ {p.foodCap}</div>}>
  <FoodDetails {...p}/>
</LinePanel> 