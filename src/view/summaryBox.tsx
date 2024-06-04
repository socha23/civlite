import React from 'react';
import { Box } from './box'
import { GameModel } from '../model/gameModel'
import { ResourceType, allResourceTypes } from '../model/resources';
import { FontSizes, ResourceLabels, Icons, DividerColors, Colors } from './icons';
import { Line, LineProps } from './line';

export type SummaryBoxProps = {
  civName: string
  inventory: LineProps[]
}

export function summaryBoxProps(model: GameModel): SummaryBoxProps {
  const totalPopulation = {
    icon: Icons.population,
    label: "Population",
    count: model.population.total,
  }
  
  const resources = allResourceTypes().map(t => {
    const res = model.resources.resource(ResourceType[t])
    return {
      icon: Icons[t],
      label: ResourceLabels[t],
      count: res.count,
      cap: res.cap,
      trend: model.production(t) - model.consumption(t)
    }})
  
  
  return {
    civName: model.civName,
    inventory: [totalPopulation].concat(resources)
  }
}

const Inventory = (p: {items: LineProps[]}) => <div 
  style={{
    display: "flex",
    flexDirection: "column",
  }}>
  {
    p.items.map((i, idx) => 
    <div
    className="dottedDividers"
    style={{
      borderWidth: 1,
      paddingTop: 6,
      paddingBottom: 6,
      borderColor: DividerColors.light,
    }}>
    <Line key={idx} {...i}/>
    </div>)
  }
</div>

const ResourceTrend = (p: {delta: number}) => p.delta === 0 ? <span/> : <span style={{
  color: p.delta > 0 ? "#0a0": "#a00"
}}>{p.delta > 0 ? "+" : ""}{p.delta.toFixed(1)}</span>

export const CivName = (p: {civName: string}) => <div style={{
  fontSize: FontSizes.xbig,
  color: Colors.captions,
}}>{p.civName}</div>


export const SummaryBox = (p: SummaryBoxProps) =>
  <Box>
    <div style={{
      display: "flex",
      color: Colors.captions,
      fontSize: FontSizes.normal,
      flexDirection: "column",
      gap: 8,
    }}>

      <CivName civName={p.civName}/>
      <Inventory items={p.inventory}/>
    </div>
  </Box>


