import React from 'react';
import { GameModel } from '../model/gameModel'
import { ActionProps, propsForAction, ActionRow3 } from './action';
import { HuntingLabels, } from './labels';
import { AnimalStock, } from '../model/huntingModel';
import { FontSizes } from './icons';
import { CoordsCatcher, coordsIdHuntStock } from './coordsCatcher';

export type HuntingProps = {
  stocks: AnimalStock[],
  huntingActions: ActionProps[],
}

export function huntingProps(model: GameModel): HuntingProps {
  return {
    stocks: model.hunting.stocks,
    huntingActions: [
      propsForAction(model, model.hunting.smallHuntAction, HuntingLabels.Small),
      propsForAction(model, model.hunting.largeHuntAction, HuntingLabels.Large),
    ]
  }
}

const AnimalStockView = (p: AnimalStock) => <div style={{
  display: "flex",
}}>
  <div style={{
    width: 100,
    fontSize: FontSizes.normal,
  }}>
    {HuntingLabels[p.type]}
  </div>
  <div>
    <CoordsCatcher id={coordsIdHuntStock(p.type)}>
      {Math.floor(p.count)} / {Math.floor(p.cap)}
    </CoordsCatcher>
  </div>
</div>

const AnimalStocks = (p: HuntingProps) => <div style={{
  padding: 4,
  display: "flex",
  flexDirection: "column",
}}>
  {p.stocks.map((stock, idx) => <AnimalStockView {...stock} key={idx}/>)}
</div>

export const HuntingSection = (p: HuntingProps) => <div style={{
  display: "flex",
  flexDirection: "column",
  gap: 4,
}}>
  <AnimalStocks {...p}/>
  {
    p.huntingActions.map((e, idx) => <ActionRow3 {...e} key={idx} displayRewards={true}/>)
  } 
</div>

