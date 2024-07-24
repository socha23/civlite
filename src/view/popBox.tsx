import React, {PropsWithChildren} from 'react';
import { Box } from './box'
import { GameModel } from '../model/gameModel'
import { ActionProps, propsForAction, ActionRow3 } from './action';
import { PopType, isAssignable } from '../model/pops';
import { FontSizes, TrendColors, DividerColors, Icons, Colors, Labels } from './icons';
import { formatNumber } from '../model/utils';
import { Amount, ResourceAmount, WorkAmount } from '../model/amount';
import { PopBoxLabels, PopulationRecruitLabels, PopulationUnrecruitLabels } from './labels';
import { CoordsCatcher, coordsIdPopCount } from './elementCoordinatesHolder';
import { Row } from './line';
import { Amounts } from './amount';
import { ResourceType } from '../model/resources';

export type PopBoxProps = {
  popType: PopType,
  popLabel: string,
  count: number,
  unassignedCount: number,
  buyAction: ActionProps,
  sellAction: ActionProps,
  foodConsumption: number,
  singlePopWork: WorkAmount[],
  totalWork: WorkAmount[],
  singlePopProduction: ResourceAmount[],
  totalProduction: ResourceAmount[],
}

export function popBoxProps(model: GameModel, type: PopType): PopBoxProps {
  const pop = model.population.pop(type)
  return {
    popType: type,
    popLabel: Labels.Plural[type],
    foodConsumption: pop.singlePopFoodConsumption,
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
    singlePopWork: pop.singlePopWork,
    totalWork: pop.work.filter(c => c.count !== 0),
    singlePopProduction: pop.singlePopProduction,
    totalProduction: pop.production.filter(c => c.count !== 0),
  }
}

export const ResourcesList = (p: {items: Amount[], caption?: string, color?: string}) => <div style={{
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



const PopHeader = (p: PopBoxProps) => <div style={{
  display: "flex",
  fontSize: FontSizes.big,
  alignItems: 'center',
  color: Colors.captions,
  paddingBottom: 4,
}}>
  <div style={{width: 28, fontSize: FontSizes.normal, textAlign: 'center'}}>
    <i className={Icons[p.popType]}/>
  </div>
  <div style={{flexGrow: 1}}>{p.popLabel}</div>
    
  <div style={{
    width: 80,
    textAlign: 'right',
  }}>
    <CoordsCatcher id={coordsIdPopCount(p.popType)}>
      {isAssignable(p.popType) ? p.unassignedCount + " / " + p.count : p.count}
    </CoordsCatcher>
  </div>
  <div style={{width: 60, display: 'flex', justifyContent: 'flex-end'}}>
  </div>
</div>


const PopResources = (p: PopBoxProps) => <div style={{
  display: "flex",
  gap: 12,
  paddingTop: 2,
  paddingBottom: 2,
}}>
  <Row>
    <Amounts items={[{type: ResourceType.Food, count: -p.foodConsumption}]}/>
    {PopBoxLabels.FoodConsumptionPostfix}
  </Row>
  { p.singlePopProduction.length + p.singlePopWork.length > 0 && 
    <Row>
      <Amounts items={[...p.singlePopProduction, ...p.singlePopWork]}/>
      {PopBoxLabels.PerSecond}
  </Row>
  }
  <div style={{flexGrow: 1}}/>
  <ResourcesList items={[...p.totalProduction, ...p.totalWork]} />

</div>

export const PopBox = (p: PropsWithChildren<PopBoxProps>) =>
  <Box>
    <div 
    className='dottedDividersParent'
    style={{
      paddingTop: 8,
      paddingBottom: 12,
    }}>
      <PopHeader {...p}/>
      <PopResources {...p}/>
      <div>
        <ActionRow3 {...p.buyAction}/>
        <ActionRow3 {...p.sellAction} displayRewards={true}/>
      </div>
      {p.children}
    </div>
  </Box>


