import { ResourceType } from "./resources"
import { assignResources, Amount, pops, resources, ResourceAmount, WorkAmount, work } from "./amount"
import { WorkType } from "./work"
import { SEASON_DURATION } from "./calendarModel"

export enum PopType {
  Idler = "Idler", 
  Hunter = "Hunter", 
  Laborer = "Laborer", 
  Herder = "Herder",
  Farmer = "Farmer",
  Brave = "Brave",
  Slinger = "Slinger",
}


const DEFAULT_POP_DEFINITION = {
  timeCost: 5,
  foodConsumption: 1,
  workCost: [] as WorkAmount[],
  buyCost: [
    pops(PopType.Idler, 1),
  ] as Amount[],
  production: [] as ResourceAmount[],
  work: [] as WorkAmount[],
  
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
    foodConsumption: 1,
    buyCost: [resources(ResourceType.Food, 2)],
    timeCost: 3,
    work: [
      work(WorkType.Gathering, 1),
    ],
  },
  [PopType.Hunter]: {
    timeCost: 3,
    foodConsumption: 1,
    buyCost: [
      pops(PopType.Idler, 1),
    ],
    work: [
      work(WorkType.Hunting, 1)
    ],
  },
  [PopType.Laborer]: {
    timeCost: 0,
    foodConsumption: 2,
    buyCost: [
      pops(PopType.Idler, 1),
      resources(ResourceType.Food, 5),
    ],
    work: [
      work(WorkType.Labor, 0.2)
    ],
  },
  [PopType.Herder]: {
    timeCost: 0,
    foodConsumption: 0,
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
    timeCost: 0,
    foodConsumption: 0,
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
    foodConsumption: 1,
    assignableToArmy: true,
    battleOrder: 10,
    closeAttack: 2,
    hp: 2,
    marchDuration: 6,
  },
  [PopType.Slinger]: {
    foodConsumption: 1,
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