import React from 'react';
import { Box } from './box'
import { GameModel } from '../model/gameModel'
import { ActionButton, ActionProps, propsForAction } from './action';
import { PopType } from '../model/pops';
import { FontSizes, PopLabels, ResourceIcons, TrendColors, Labels, DividerColors, BuyPopLabels } from './icons';
import { Line, LineProps } from './line';
import { Resources, resources } from '../model/costs';

export type PopBoxProps = {
  popLabel: string,
  count: number,
  buyAction: ActionProps,
  singlePopResourceBalance: Resources[], 
}

export function popBoxProps(model: GameModel, type: PopType): PopBoxProps {
  const pop = model.population.pop(type)
  return {
    popLabel: PopLabels[type],
    count: pop.count,
    buyAction: propsForAction(model, pop.buyAction, BuyPopLabels[type]),
    singlePopResourceBalance: 
      pop.singlePopBalance
  }
}

export const ResourcesList = (p: {items: Resources[]}) => <div style={{
  display: "flex",
  gap: 4,
  fontSize: FontSizes.small,
}}>
  {p.items.map((i, idx) => <div key={idx} style={{
    display: "flex",
    gap: 2,
    color: i.count > 0 ? TrendColors.positive : TrendColors.negative
  }}>
    <div>{i.count > 0 ? "+" : ""}</div>
    <div>{i.count.toFixed(1)}</div>
    <div><i className={ResourceIcons[i.type]}/></div>
  </div>)}
  <div>{Labels.PerPop}</div>
</div>

export const PopBox = (p: PopBoxProps) =>
  <Box>
    <div className="dottedDividers" style={{
      display: "flex",
      borderColor: DividerColors.light,
      fontSize: FontSizes.big,
      paddingBottom: 4,
    }}>
      <div style={{
        width: 85
      }}>
        {p.popLabel}
      </div>
      <div style={{
        width: 80,
        textAlign: 'right',
      }}>
        {p.count}
      </div>
    </div>
    <div className='dottedDividers' style={{
      borderColor: DividerColors.light,
      paddingTop: 4,
      paddingBottom: 4,
    }}>
      <ResourcesList items={p.singlePopResourceBalance}/>
    </div>
    <div>
      <ActionButton {...p.buyAction}/>
    </div>
  </Box>


