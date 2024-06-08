import { ResourceType } from "./resources"
import { pops, resources } from "./costs"

export enum PopType {
  Idler = "Idler", 
  Gatherer = "Gatherer", 
  Laborer = "Laborer", 
  Herder = "Herder",
  Farmer = "Farmer",
  Brave = "Brave",
}

const DEFAULT_POP_DEFINITION = {
  initialCount: 0,
  buyCost: [
    pops(PopType.Idler, 1),
  ],
  sellValue: [
    pops(PopType.Idler, 1),
  ],
  production: [],
  consumption: [],
  assignableToArmy: false,
}


const PopTypeDefinitions = {
  [PopType.Idler]: {
    initialCount: 1,
    buyCost: [resources(ResourceType.Food, 2)],
    sellValue: [],
    production: [
      resources(ResourceType.Insight, 0.1)
    ],
    consumption: [
      resources(ResourceType.Food, 0.1)
    ]  
  },
  [PopType.Gatherer]: {
    initialCount: 9,
    buyCost: [
      pops(PopType.Idler, 1),
      resources(ResourceType.Forest, 1)
    ],
    sellValue: [
      pops(PopType.Idler, 1),
      resources(ResourceType.Forest, 1)
    ],
    production: [
      resources(ResourceType.Food, 0.1)
    ]  
  },
  [PopType.Laborer]: {
    buyCost: [
      pops(PopType.Idler, 1),
      resources(ResourceType.Food, 5),
    ],
    sellValue: [pops(PopType.Idler, 1)],
    production: [
      resources(ResourceType.Labor, 0.2)
    ],
    consumption: [
      resources(ResourceType.Food, 1)
    ]  
  },
  [PopType.Herder]: {
    buyCost: [
      pops(PopType.Idler, 1),
      resources(ResourceType.Herds, 1),
      resources(ResourceType.Labor, 3),
      resources(ResourceType.Grassland, 1),
    ],
    sellValue: [
      pops(PopType.Idler, 1),
      resources(ResourceType.Herds, 1),
      resources(ResourceType.Grassland, 1),
    ],
    production: [
      resources(ResourceType.Food, 0.6)
    ],
  },
  [PopType.Farmer]: {
    buyCost: [
      pops(PopType.Idler, 1),
      resources(ResourceType.Labor, 5),
      resources(ResourceType.Grassland, 1),
    ],
    sellValue: [
        pops(PopType.Idler, 1),
        resources(ResourceType.Grassland, 1),
    ],
    production: [
      resources(ResourceType.Food, 0.4)
    ],
  },
  [PopType.Brave]: {
    initialCount: 5,
    assignableToArmy: true,
  }
}

export function popTypeDefinition(t: PopType) {
  return {...DEFAULT_POP_DEFINITION, ...PopTypeDefinitions[t]}
}

export function popTypesAssignableToArmy(): PopType[] {
  return Object.values(PopType).filter(t => popTypeDefinition(PopType[t]).assignableToArmy)
}

export function isAssignable(t: PopType) {
  const def = popTypeDefinition(t)
  return def.assignableToArmy
}