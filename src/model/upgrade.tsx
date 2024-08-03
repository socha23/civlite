import { ResourceType } from "./resources"
import { ResourceAmount, WorkAmount, resources, work } from "./amount"
import { GameModel } from "./gameModel"
import { WorkType } from "./work"
import { PopType } from "./pops"

function insight(count: number): WorkAmount {
    return work(WorkType.Insight, count)
}



export enum UpgradeType {
    Init = "Init",
    Research = "Research"
}

export const STARTING_UPGRADES = ["enable_insight"]

export const UpgradeDefinitions: UpgradeDefinition[] = [
    {
        id: "enable_insight",
        title: "The New Beginning",
        buttonTitle: "Think",
        description: "I think, therefore...",
        timeCost: 1,
        onComplete: (model) => {
            model.progress.ManualCollection = true
            model.progress.ManualResearch = true

            model.upgrades.addAvailableUpgrade("enable_food_gathering")
        }
    },
    {
        id: "enable_food_gathering",
        title: "Food",
        flavorText: "...I am hungry",
        description: "Enables manual food collection",
        workCost: [insight(3)],
        onComplete: (model) => {
            model.progress.ManualFood = true
            model.progress.Inventory = true
            model.progress.ResourceEnabled[ResourceType.Food] = true
        
            model.upgrades.addAvailableUpgrade("research_pack_primitive")
        }
    },
    {
        id: "research_pack_primitive",
        title: "Basic Tribe Pack",
        flavorText: "I am not alone",
        description: "Enables basic tribal upgrades",
        initialCost: [resources(ResourceType.Food, 3)],
        onComplete: (model) => {
            model.progress.ManualFood = true
            model.progress.Inventory = true
            model.progress.ResourceEnabled[ResourceType.Food] = true
        
            model.upgrades.addAvailableUpgrade("basic_tribe")
            model.upgrades.addAvailableUpgrade("upgrade_manual_food_collection")
            model.upgrades.addAvailableUpgrade("enable_calendar")
            model.upgrades.addAvailableUpgrade("enable_idler_insight")
        }
    },
    {
        id: "basic_tribe",
        title: "Tribe",
        description: "Enables Gatherers",
        flavorText: "We have something in common. Perhaps I could lead them?",
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
        requiredUpgrades: ["basic_tribe"],
        title: "Speech",
        description: "Enable Gatherer insight",
        flavorText: "Refine our grunts into proper speech",
        workCost: [insight(5)],
        onComplete: (model) => {
            model.population.idlers.definition.work.push(insight(0.1))
        }
    },
]

export type UpgradeDefinition = {
    id: string,

    type?: UpgradeType

    exclusivityGroup?: string,
    
    timeCost?: number,
    workCost?: WorkAmount[],
    initialCost?: ResourceAmount[], 

    requiredUpgrades?: string[],

    title: string,
    buttonTitle?: string,
    description?: string,
    flavorText?: string,

    onComplete?: ((model: GameModel) => void)
  }
  
