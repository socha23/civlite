import { ResourceType } from "./resources"
import { assignResources, Amount, pops, resources, ResourceAmount, WorkAmount, work } from "./amount"
import { WorkType } from "./work"

export enum PopType {
  Idler = "Idler", 
  Gatherer = "Gatherer", 
  Laborer = "Laborer", 
  Herder = "Herder",
  Farmer = "Farmer",

  Brave = "Brave",
  Slinger = "Slinger",
}


const DEFAULT_POP_DEFINITION = {
  initialCount: 0,
  timeCost: 5,
  workCost: [] as WorkAmount[],
  buyCost: [
    pops(PopType.Idler, 1),
  ] as Amount[],
  production: [] as ResourceAmount[],
  work: [] as WorkAmount[],
  consumption: [] as ResourceAmount[],
  
  assignableToArmy: false,
  battleOrder: 1,

  closeAttack: 1,
  rangedAttack: 0,
  hp: 1,

  marchDuration: 10,
}

type PopDefinition = typeof DEFAULT_POP_DEFINITION

const PopTypeDefinitions = {
  [PopType.Idler]: {
    initialCount: 1,
    buyCost: [resources(ResourceType.Food, 2)],
    timeCost: 3,
    work: [
      work(WorkType.Insight, 0.1)
    ],
    consumption: [
      resources(ResourceType.Food, 0.1)
    ]  
  },
  [PopType.Gatherer]: {
    initialCount: 9,
    buyCost: [
      pops(PopType.Idler, 1),
      assignResources(ResourceType.Forest, 1)
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
    work: [
      work(WorkType.Labor, 0.2)
    ],
    consumption: [
      resources(ResourceType.Food, 1)
    ]  
  },
  [PopType.Herder]: {
    workCost: [
      work(WorkType.Labor, 3)
    ],
    buyCost: [
      pops(PopType.Idler, 1),
      assignResources(ResourceType.Herds, 1),
      assignResources(ResourceType.Grassland, 1),
    ],
    production: [
      resources(ResourceType.Food, 0.6)
    ],
  },
  [PopType.Farmer]: {
    workCost: [
      work(WorkType.Labor, 3)
    ],
    buyCost: [
      pops(PopType.Idler, 1),
      assignResources(ResourceType.Grassland, 1),
    ],
    production: [
      resources(ResourceType.Food, 0.4)
    ],
  },
  [PopType.Brave]: {
    initialCount: 5,
    assignableToArmy: true,
    battleOrder: 10,
    closeAttack: 2,
    hp: 2,
    marchDuration: 6,
  },
  [PopType.Slinger]: {
    initialCount: 5,
    assignableToArmy: true,
    battleOrder: 20,
    closeAttack: 1,
    rangedAttack: 3,
    hp: 2,
    marchDuration: 6,
  },
}

export function popTypeDefinition(t: PopType): PopDefinition {
  return {...DEFAULT_POP_DEFINITION, ...PopTypeDefinitions[t]}
}

export function popTypesAssignableToArmy(): PopType[] {
  return Object.values(PopType).filter(t => popTypeDefinition(PopType[t]).assignableToArmy)
}

export function isAssignable(t: PopType) {
  const def = popTypeDefinition(t)
  return def.assignableToArmy
}