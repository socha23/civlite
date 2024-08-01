import React, { PropsWithChildren } from 'react';
import { Box } from './box'
import { GameModel } from '../model/gameModel'
import { ResourceType, resourceDefinition } from '../model/resources';
import { FontSizes, Icons, Colors, Labels } from './icons';
import { Line, LineProps } from './line';
import { FoodLinePanel, foodProps, FoodProps } from './food';
import { ProgressType } from '../model/progress';

export type InventoryBoxProps = {
  population: LineProps
  food: FoodProps
  herds: LineProps
  forest: LineProps
  grassland: LineProps
  progress: ProgressType
}

type DisplayedResourceType = ResourceType.Herds | ResourceType.Food | ResourceType.Forest | ResourceType.Grassland

const ResourceGroups = {
  [ResourceType.Herds]: 0,  
  [ResourceType.Food]: 1,
  [ResourceType.Forest]: 2,
  [ResourceType.Grassland]: 2,
}


function lineProps(model: GameModel, t: DisplayedResourceType): LineProps {
  const res = model.resources.resource(t)
  const resDef = resourceDefinition(t)
  return {
    icon: Icons[t],
    label: Labels[t],
    value: resDef.assignable ? res.unassigned : res.count,
    max: resDef.assignable ? res.count : res.cap,
    trend: model.production(t),
  }
}

export function summaryBoxProps(model: GameModel): InventoryBoxProps {
  return {
    progress: model.progress,
    population: {
      icon: Icons.population,
      label: "Population",
      value: model.population.total,
    },
    food: foodProps(model),
    herds: lineProps(model, ResourceType.Herds),
    forest: lineProps(model, ResourceType.Forest),
    grassland: lineProps(model, ResourceType.Grassland),
  }
}

const InventoryGroup = (p: PropsWithChildren<{}>) => <div 
  style={{
    display: "flex",
    flexDirection: "column",
    paddingTop: 4,
    paddingBottom: 4,
  }}>
  {p.children}
</div>

const InventoryItem = (p: LineProps) => <div style={{
  paddingTop: 4,
  paddingBottom: 4,
}}>
  <Line {...p}/>
</div>

export const InventoryBox = (p: InventoryBoxProps) =>
  <Box>
    <div className="dottedDividersParent" style={{
      display: "flex",
      color: Colors.captions,
      fontSize: FontSizes.normalPlus,
      flexDirection: "column",
    }}>
      {p.progress.PopulationDisplay && <InventoryGroup>
        <InventoryItem {...p.population}/>
        {p.progress.ResourceEnabled[ResourceType.Herds] &&
          <InventoryItem {...p.herds}/>
        }
      </InventoryGroup>}
      {p.progress.ResourceEnabled[ResourceType.Food] &&
      <InventoryGroup>
        <FoodLinePanel {...p.food}/>
      </InventoryGroup>
      }
      {p.progress.ResourceEnabled[ResourceType.Forest] &&
      <InventoryGroup>  
        <InventoryItem {...p.forest}/>
        {p.progress.ResourceEnabled[ResourceType.Grassland] && <InventoryItem {...p.grassland}/>}
      </InventoryGroup>
      }
    </div>
  </Box>


