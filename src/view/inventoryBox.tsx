import React from 'react';
import { Box } from './box'
import { GameModel } from '../model/gameModel'
import { ResourceType, allResourceTypes } from '../model/resources';
import { FontSizes, Icons, DividerColors, Colors, Labels } from './icons';
import { Line, LineProps } from './line';
import { group } from 'console';

export type InventoryBoxProps = {
  civName: string
  inventory: (LineProps & {group: number})[]
}


const ResourceGroups = {
  [ResourceType.Herds]: 0,  
  [ResourceType.Food]: 1,
  [ResourceType.Insight]: 1,
  [ResourceType.Labor]: 1,
  [ResourceType.Forest]: 2,
  [ResourceType.Grassland]: 2,
}

export function summaryBoxProps(model: GameModel): InventoryBoxProps {
  const totalPopulation = {
    icon: Icons.population,
    label: "Population",
    count: model.population.total,
    group: 0,
  }
  
  const resources = allResourceTypes().map(t => {
    const res = model.resources.resource(ResourceType[t])
    return {
      icon: Icons[t],
      label: Labels[t],
      count: res.count,
      cap: res.cap,
      trend: model.production(t) - model.consumption(t),
      group: ResourceGroups[t]
    }})  
  return {
    civName: model.civName,
    inventory: [totalPopulation].concat(resources)
  }
}


const POPULATION_RESOURCE_GROUP = 0



const Inventory = (p: {items: ({group: number} & LineProps)[], group: number}) => <div 
  style={{
    display: "flex",
    flexDirection: "column",
  }}>
  {
    p.items
      .filter(i => i.group === p.group)
      .map((i, idx) => 
    <div
    key={idx}
    className="dottedDividers"
    style={{
      borderWidth: 1,
      paddingTop: 8,
      paddingBottom: 6,
      borderColor: DividerColors.light,
    }}>
    <Line {...i}/>
    </div>)
  }
</div>

export const InventoryBox = (p: InventoryBoxProps) =>
  <Box>
    <div className="dividersParent" style={{
      display: "flex",
      color: Colors.captions,
      fontSize: FontSizes.normal,
      flexDirection: "column",
      paddingBottom: 8,
    }}>
      <Inventory items={p.inventory} group={0}/>
      <Inventory items={p.inventory} group={1}/>
      <Inventory items={p.inventory} group={2}/>
    </div>
  </Box>


