import React from 'react';
import { Box } from './box'
import { GameModel } from '../model/gameModel'
import { ActionProps, ActionButton, propsForAction, ActionRow3 } from './action';
import { PopType, isAssignable } from '../model/pops';
import { FontSizes, TrendColors, DividerColors, Icons, Colors, Labels } from './icons';
import { formatNumber } from '../model/utils';
import { ResourceAmount } from '../model/amount';
import { PopulationRecruitLabels, PopulationUnrecruitLabels } from './labels';

export type PopBoxProps = {
  popType: PopType,
  popLabel: string,
  count: number,
  unassignedCount: number,
  buyAction: ActionProps,
  sellAction: ActionProps,
  resourceBalance: ResourceAmount[], 
  singlePopBalance: ResourceAmount[],
}

export function popBoxProps(model: GameModel, type: PopType): PopBoxProps {
  const pop = model.population.pop(type)
  return {
    popType: type,
    popLabel: Labels.Plural[type],
    count: pop.count,
    unassignedCount: pop.unassignedCount,
    buyAction: propsForAction(model, pop.buyAction, {
      title: PopulationRecruitLabels[type].ActionTitle,
      buttonLabel: PopulationRecruitLabels[type].ButtonTitle,
      //description: PopulationRecruitLabels[type].Description,
    }),
    sellAction: propsForAction(model, pop.sellAction, {
      title: PopulationUnrecruitLabels[type].ActionTitle,
      buttonLabel: PopulationUnrecruitLabels[type].ButtonTitle,
      //description: PopulationUnrecruitLabels[type].Description,
    }),
    resourceBalance: pop.resourceBalance,
    singlePopBalance: pop.singlePopBalance,
  }
}

export const ResourcesList = (p: {items: ResourceAmount[], caption: string, color?: string}) => <div style={{
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



export const PopBox = (p: PopBoxProps) =>
  <Box>
    <div 
    className='dottedDividersParent'
    style={{
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
          {isAssignable(p.popType) ? p.unassignedCount + " / " + p.count : p.count}
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
      <ActionRow3 {...p.buyAction}/>
      <ActionRow3 {...p.sellAction} displayRewards={true}/>
    </div>
  </Box>


