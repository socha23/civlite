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
        title: "Food",
        flavorText: "...I am hungry",
        description: "Enables manual food collection",
        workCost: [insight(3)],
        onComplete: (model) => {
            model.progress.ManualFood = true
            model.progress.Inventory = true
            model.progress.ResourceEnabled[ResourceType.Food] = true
        }
    },
    {
        id: "basic_tribe",
        requiredResearch: ["enable_food_gathering"],
        title: "Tribe",
        description: "Enables Gatherers",
        flavorText: "We have something in common. Perhaps I could lead them?",
        initialCost: [resources(ResourceType.Food, 3)],
        workCost: [insight(3)],
        onComplete: (model) => {
            model.progress.CivName = "The Tribe"

            model.progress.PopulationDisplay = true
            model.progress.FoodStocks = true
            model.progress.ResourceEnabled[ResourceType.Forest] = true
            model.progress.PopEnabled[PopType.Idler] = true
            model.progress.GameLostEnabled = true

            model.resources.food.add(10)
            model.resources.forest.add(3)
            model.population.idlers.add(2)

        }
    },
    {
        id: "upgrade_manual_food_collection",
        requiredResearch: ["enable_food_gathering"],
        title: "Edible fruit",
        description: "Upgrade manual food collection speed",
        flavorText: "What if I ate this?",
        workCost: [insight(5)],
        onComplete: (model) => {
            model.manualCollection.collectFood.timeAcc.required = 2
        }
    },
    {
        id: "enable_calendar",
        requiredResearch: ["enable_insight"],
        title: "Basic timekeeping",
        description: "Shows Calendar and Log",
        flavorText: "World around me changes in a cycle",
        workCost: [insight(5)],
        onComplete: (model) => {
            model.log.reset()
            model.progress.Calendar = true
            model.progress.Log = true
        }
    },
    {
        id: "enable_idler_insight",
        requiredResearch: ["basic_tribe"],
        title: "Speech",
        description: "Enable Gatherer insight",
        flavorText: "Refine our grunts into proper speech",
        workCost: [insight(5)],
        onComplete: (model) => {
            model.population.idlers.definition.work.push(insight(0.1))
        }
    },
]

export type ResearchDefinition = {
    id: string,

    exclusivityGroup?: string,
    
    timeCost?: number,
    workCost?: WorkAmount[],
    initialCost?: ResourceAmount[], 

    requiredResearch?: string[],

    title: string,
    buttonTitle?: string,
    description?: string,
    flavorText?: string,

    onComplete?: ((model: GameModel) => void)
  }
  
