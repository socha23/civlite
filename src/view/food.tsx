import React from 'react';
import { GameModel } from '../model/gameModel'
import { FoodLabels, popLabelPlural, } from './labels';
import { PopType } from '../model/pops';
import { ResourceType } from '../model/resources';
import { LinePanel } from './linePanel';
import { Colors, FontSizes, Icons, Labels } from './icons';
import { PopAmount } from '../model/amount';
import { coordsIdResourceStock } from './elementCoordinatesHolder';
import { ProgressType } from '../model/progress';

export type FoodProps = {
  progress: ProgressType,
  foodCount: number,
  foodCap: number,
  expectedConsumption: {
    type: PopType,
    count: number,
  }[],
  timeUntilHunger: number,
  expectedHungerDeaths: PopAmount[],
}

export function foodProps(model: GameModel): FoodProps {
  const food = model.resources.resource(ResourceType.Food)
  return {
    progress: model.progress,
    foodCount: food.count,
    foodCap: food.cap || 0,
    expectedConsumption: model.hunger.foodConsumptionPerSeason,
    timeUntilHunger: model.hunger.timeUntilHunger,
    expectedHungerDeaths: model.hunger.simulateConsumption().hungerDeaths,
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
  {p.progress.FoodStocks &&
    <div>{FoodLabels.FoodStocks} {p.timeUntilHunger}s</div>
}
{/*
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
      }}>{popLabelPlural(p.type)}</div>
      <div style={{
        gridRow: idx,
        gridColumn: 2
      }}>{p.count}</div>
    </React.Fragment>)}
  </div>
*/}
</div>

export const FoodLinePanel = (p: FoodProps) => <LinePanel
  coordsId={coordsIdResourceStock(ResourceType.Food)}
  icon={Icons[ResourceType.Food]}
  label={Labels[ResourceType.Food]}
  value={p.foodCount}
  postfix={<div>/ {p.foodCap}</div>}>
  <FoodDetails {...p}/>
</LinePanel> 

export const HungerWarning = (p: FoodProps) => p.expectedHungerDeaths.length > 0 ? <div style={{
  display: "flex",
  flexDirection: "column",
  gap: 4,
  borderWidth: 4,
  borderColor: Colors.Warning,
}}>
  <div style={{fontSize: FontSizes.big, color: Colors.Warning}}>{FoodLabels.HungerWarning}</div>
  <div style={{fontSize: FontSizes.small}}>{FoodLabels.HungerWarningDesc}</div>
  {
    p.expectedHungerDeaths.map(d => <div key={d.type}>
      {d.count} {popLabelPlural(d.type)}  
    </div>)
  }
</div> : <div/>
