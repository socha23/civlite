import { ResourceType } from "./resources"
import { pops, resources } from "./costs"

export enum PopType {
  Idler = "Idler", 
  Gatherer = "Gatherer", 
  Laborer = "Laborer", 
  Farmer = "Farmer"
}

export const PopTypeDefinitions = {
  [PopType.Idler]: {
    initialCount: 1,
    buyCost: [resources(ResourceType.Food, 2)],
    production: [
    ],
    consumption: [
      resources(ResourceType.Food, 0.5)
    ]  
  },
  [PopType.Gatherer]: {
    initialCount: 9,
    buyCost: [
      pops(PopType.Idler, 1)
    ],
    production: [
      resources(ResourceType.Food, 0.1)
    ],
    consumption: [
    ]  
  },
  [PopType.Laborer]: {
    initialCount: 0,
    buyCost: [
      pops(PopType.Idler, 1),
      resources(ResourceType.Food, 5),
    ],
    production: [
      resources(ResourceType.Labor, 1)
    ],
    consumption: [
      resources(ResourceType.Food, 1)
    ]  
  },
  [PopType.Farmer]: {
    initialCount: 0,
    buyCost: [
      pops(PopType.Idler, 1),
      resources(ResourceType.Food, 10),
      resources(ResourceType.Labor, 5),
      ],
    production: [
      resources(ResourceType.Food, 0.5)
    ],
    consumption: [
    ]  
  },
}

