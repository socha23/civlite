import { ResourceType } from "./resources"
import { pops, resources } from "./costs"

export enum PopType {
  Gatherer = "Gatherer", 
  Laborer = "Laborer", 
  Farmer = "Farmer"
}

export const PopTypeDefinitions = {
  [PopType.Gatherer]: {
    initialCount: 50,
    buyCost: [resources(ResourceType.Food, 5)],
    production: [
      resources(ResourceType.Food, 0.1)
    ],
    consumption: [
    ]  
  },
  [PopType.Laborer]: {
    initialCount: 0,
    buyCost: [
      resources(ResourceType.Food, 10),
      pops(PopType.Gatherer, 1)
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
      resources(ResourceType.Food, 10),
      resources(ResourceType.Labor, 5),
      pops(PopType.Gatherer, 1)
      ],
    production: [
      resources(ResourceType.Food, 0.5)
    ],
    consumption: [
    ]  
  },
}

