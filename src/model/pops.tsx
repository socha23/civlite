import { ResourceType } from "./resources"
import { pops, resources } from "./costs"

export enum PopType {
  Gatherer, Laborer
}

export const PopTypeDefinitions = {
  [PopType.Gatherer]: {
    initialCount: 50,
    buyCost: [resources(ResourceType.Food, 2)],
    production: [
      resources(ResourceType.Food, 1.02)
    ],
    consumption: [
      resources(ResourceType.Food, 1)
    ]  
  },
  [PopType.Laborer]: {
    initialCount: 0,
    buyCost: [
      resources(ResourceType.Food, 5),
      pops(PopType.Gatherer, 1)
      ],
    production: [
      resources(ResourceType.Labor, 1)
    ],
    consumption: [
      resources(ResourceType.Food, 1)
    ]  
  },
}

