import React from 'react';
import { Box } from './box'
import { GameModel } from '../model/gameModel'
import { ResourceType, allResourceTypes, resourceDefinition } from '../model/resources';
import { FontSizes, Icons, DividerColors, Colors, Labels } from './icons';
import { Line, LineProps } from './line';

export type InventoryBoxProps = {
  civName: string
  inventory: (LineProps & {group: number})[]
}

const ResourceGroups = {
  [ResourceType.Herds]: 0,  
  [ResourceType.Food]: 1,
  [ResourceType.Forest]: 2,
  [ResourceType.Grassland]: 2,
}

export function summaryBoxProps(model: GameModel): InventoryBoxProps {
  const totalPopulation = {
    icon: Icons.population,
    label: "Population",
    value: model.population.total,
    group: 0,
  }
  
  const resources = allResourceTypes().map(t => {

    const res = model.resources.resource(t)
    const resDef = resourceDefinition(t)
    return {
      icon: Icons[t],
      label: Labels[t],
      value: resDef.assignable ? res.unassigned : res.count,
      max: resDef.assignable ? res.count : res.cap,
      trend: model.production(t) - model.consumption(t),
      group: ResourceGroups[t]
    }})  
  return {
    civName: model.civName,
    inventory: [totalPopulation].concat(resources)
  }
}

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
      fontSize: FontSizes.normalPlus,
      flexDirection: "column",
      paddingBottom: 8,
    }}>
      <Inventory items={p.inventory} group={0}/>
      <Inventory items={p.inventory} group={1}/>
      <Inventory items={p.inventory} group={2}/>
    </div>
  </Box>


