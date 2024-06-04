import { ResourceType } from "./resources"
import { pops, resources } from "./costs"

export enum PopType {
  Idler = "Idler", 
  Gatherer = "Gatherer", 
  Laborer = "Laborer", 
  Herder = "Herder",
  Farmer = "Farmer",
}

export const PopTypeDefinitions = {
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
    sellValue: [pops(PopType.Idler, 1)],
    production: [
      resources(ResourceType.Labor, 0.2)
    ],
    consumption: [
      resources(ResourceType.Food, 1)
    ]  
  },
  [PopType.Herder]: {
    initialCount: 0,
    buyCost: [
      pops(PopType.Idler, 1),
      resources(ResourceType.Herds, 1),
      resources(ResourceType.Food, 5),
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
    consumption: [
    ]  
  },
  [PopType.Farmer]: {
    initialCount: 0,
    buyCost: [
      pops(PopType.Idler, 1),
      resources(ResourceType.Food, 10),
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
    consumption: [
    ]  
  },
}

