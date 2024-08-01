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
        title: "...I am hungry",
        logTitle: "Manual food collection",
        description: "I need to get some food.",
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
        title: "Those people are hungry too",
        logTitle: "Gatherers",
        description: "We have something in common. Perhaps I should lead them.",
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
        title: "What if I ate this fruit?",
        logTitle: "New edible fruit",
        description: "Upgrade manual food collection speed.",
        workCost: [insight(5)],
        onComplete: (model) => {
            model.manualCollection.collectFood.timeAcc.required = 2
        }
    },
    {
        id: "enable_calendar",
        requiredResearch: ["enable_insight"],
        title: "Ponder the passage of time",
        logTitle: "Timekeeping",
        description: "World around me changes in a cycle.",
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
        title: "Refine grunts into speech",
        logTitle: "Speech",
        description: "Enable Gatherer insight",
        workCost: [insight(5)],
        onComplete: (model) => {
            model.population.idlers.definition.work.push(insight(0.1))
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
    logTitle?: string,
    buttonTitle?: string,
    description?: string,

    onComplete?: ((model: GameModel) => void)
  }
  
