import { Action, action } from "./action"
import { ResourceType, resourceDefinition } from "./resources"
import { Amount, ResourceAmount, WorkAmount, isResourceAmount, isResourceType, resources, work } from "./amount"
import { GameModel } from "./gameModel"
import { WorkType } from "./work"
import { PopType } from "./pops"

function insight(count: number): WorkAmount {
    return work(WorkType.Insight, count)
}

export const ResearchDefinitions: ResearchDefinition[] = [
    {
        id: "enable_insight",
        title: "The New Beginning",
        buttonTitle: "Think",
        description: "I think, therefore...",
        timeCost: 1,
        onComplete: (model) => {
            model.progress.ManualCollection = true
            model.progress.ManualResearch = true
        }
    },
    {
        id: "enable_food_gathering",
        requiredResearch: ["enable_insight"],
        title: "...I am hungry.",
        description: "Enables food collection.",
        workCost: [insight(3)],
        onComplete: (model) => {
            model.progress.ManualFood = true
            model.progress.Inventory = true
            model.progress.Calendar = true
            model.progress.ResourceEnabled[ResourceType.Food] = true
        }
    },
    {
        id: "basic_tribe",
        requiredResearch: ["enable_food_gathering"],
        title: "Those people are hungry too.",
        description: "We have something in common. Perhaps I should lead them.",
        initialCost: [resources(ResourceType.Food, 3)],
        workCost: [insight(3)],
        timeCost: 3,
        onComplete: (model) => {
            model.progress.CivName = "The Tribe"
            model.progress.PopulationDisplay = true
            model.progress.FoodStocks = true
            model.progress.PopEnabled[PopType.Idler] = true
            model.resources.food.add(10)
            model.population.idlers.add(2)

        }
    },
]

export type ResearchDefinition = {
    id: string,
    
    timeCost?: number,
    workCost?: WorkAmount[],
    initialCost?: ResourceAmount[], 

    requiredResearch?: string[],

    title: string,
    buttonTitle?: string,
    description?: string,

    onComplete?: ((model: GameModel) => void)
  }
  
