import { ResourceType } from "./resources"
import { PopType } from "./pops"

export const Progress = {
    PopEnabled: {
        [PopType.Idler]: false,
        [PopType.Hunter]: false,
        [PopType.Laborer]: false,
        [PopType.Herder]: false,
        [PopType.Farmer]: false,
        [PopType.Brave]: false,
        [PopType.Slinger]: false,
    },

    CivName: "What's going on?",
    GameLostEnabled: false,
    PopulationDisplay: false,
    HungerWarnings: false,
    ManualCollection: false,
    ManualResearch: false,
    ManualFood: false,
    ManualFoodDuration: 3,
    FoodStocks: false,
    ManualLabor: false,
    Military: false,
    Inventory: false,
    Calendar: false,
    Log: false,


    ResourceEnabled: {
        [ResourceType.Food]: false,
        [ResourceType.Herds]: false,
        [ResourceType.Forest]: false,
        [ResourceType.Grassland]: false,
    }
}

export type ProgressType = typeof Progress

export function resetProgress(): ProgressType {
    return {...Progress,
        PopEnabled: {...Progress.PopEnabled},
        ResourceEnabled: {...Progress.ResourceEnabled},
    }
}