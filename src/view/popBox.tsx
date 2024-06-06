import React from 'react';
import { Box } from './box'
import { GameModel } from '../model/gameModel'
import { ActionProps, ActionButton, propsForAction } from './action';
import { PopType } from '../model/pops';
import { FontSizes, TrendColors, DividerColors, Icons, Colors, Labels } from './icons';
import { Resources } from '../model/costs';
import { formatNumber } from '../model/utils';

export type PopBoxProps = {
  popType: PopType,
  popLabel: string,
  count: number,
  buyAction: ActionProps,
  sellAction: ActionProps,
  resourceBalance: Resources[], 
  singlePopBalance: Resources[],
}

export function popBoxProps(model: GameModel, type: PopType): PopBoxProps {
  const pop = model.population.pop(type)
  return {
    popType: type,
    popLabel: Labels.Plural[type],
    count: pop.count,
    buyAction: propsForAction(model, pop.buyAction, {title: Labels.Assign[type]}),
    sellAction: propsForAction(model, pop.sellAction, {title: Labels.Unassign[type]}),
    resourceBalance: pop.resourceBalance,
    singlePopBalance: pop.singlePopBalance,
  }
}

export const ResourcesList = (p: {items: Resources[], caption: string, color?: string}) => <div style={{
  display: "flex",
  gap: 4,
  fontSize: FontSizes.small,
}}>
  {p.items.map((i, idx) => <div key={idx} style={{
    display: "flex",
    gap: 2,
    color: p.color || (i.count > 0 ? TrendColors.positive : TrendColors.negative)
  }}>
    <div>{(i.count > 0 ? "+" : "") + formatNumber(i.count)}</div>
    <div><i className={Icons[i.type]}/></div>
  </div>)}
  <div>{p.items.length > 0 && p.caption}</div>
</div>


export const RecruitRow = (p: PopBoxProps) => <div style={{
  display: "flex",
  flexDirection: "column",
}}>
  <div style={{
    display: "flex",
    fontSize: FontSizes.small,
    gap: 4,
  }}>
    <div style={{
      width: 120,
    }}>
      <ActionButton {...p.buyAction}/>
    </div>
    <div style={{
      width: 20,
      height: 20,
    }}>
      <ActionButton {...p.sellAction} title='-'/>
    </div>
  </div>
  
</div>


export const PopBox = (p: PopBoxProps) =>
  <Box>
    <div style={{
      paddingTop: 8,
      paddingBottom: 12,
    }}>
      <div style={{
        display: "flex",
        borderColor: DividerColors.light,
        fontSize: FontSizes.big,
        alignItems: 'center',
        color: Colors.captions,
      }}>
        <div style={{width: 28, fontSize: FontSizes.normal, textAlign: 'center'}}>
          <i className={Icons[p.popType]}/>
        </div>
        <div style={{flexGrow: 1}}>{p.popLabel}</div>
          
        <div style={{
          width: 80,
          textAlign: 'right',
        }}>
          {p.count}
        </div>
        <div style={{width: 60, display: 'flex', justifyContent: 'flex-end'}}>
        </div>
      </div>
      <div style={{
        borderColor: DividerColors.light,
        paddingTop: 4,
        paddingBottom: 4,
        display: "flex",
      }}>
        <ResourcesList items={p.singlePopBalance} caption={Labels.PerPop} color={Colors.default}/>
        <div style={{flexGrow: 1}}/>
        <ResourcesList items={p.resourceBalance} caption={Labels.PerSecond}/>
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        marginTop: 6
      }}>
          <RecruitRow {...p}/>
      </div>
    </div>
  </Box>


