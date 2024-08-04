import { ResourceType } from "./resources"
import { ResourceAmount, WorkAmount, resources, work } from "./amount"
import { GameModel } from "./gameModel"
import { WorkType } from "./work"
import { PopType } from "./pops"

function insight(count: number): WorkAmount {
    return work(WorkType.Insight, count)
}

function food(count: number): ResourceAmount {
    return resources(ResourceType.Food, count)
}

export enum UpgradeType {
    Init = "Init",
    Research = "Research",
    Pack = "Pack",
}

export const STARTING_UPGRADES = ["enable_insight"]

export const UpgradeDefinitions: UpgradeDefinition[] = [
    {
        id: "enable_insight",
        type: UpgradeType.Init,
        title: "The New Beginning",
        buttonTitle: "Think",
        description: "I think, therefore...",
        timeCost: 1,
        onComplete: (model) => {
            model.progress.ManualCollection = true
            model.progress.ManualResearch = true

            model.upgrades.addAvailableUpgrade("enable_food_gathering")
            model.upgrades.addAvailableUpgrade("enable_calendar")
            model.upgrades.addAvailableUpgrade("research_pack_primitive_1")
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
        
        }
    },
    {
        id: "enable_calendar",
        title: "Basic timekeeping",
        description: "Shows Calendar",
        flavorText: "World around me changes in a cycle",
        workCost: [insight(2)],
        onComplete: (model) => {
            model.log.reset()
            model.progress.Calendar = true
        }
    },
    {
        id: "research_pack_primitive_1",
        title: "Tribal Pack #1",
        type: UpgradeType.Pack,
        flavorText: "I am not alone",
        description: "Enables basic tribal upgrades",
        timeCost: 3,
        initialCost: [resources(ResourceType.Food, 3)],
        onComplete: (model) => {
            model.progress.ManualFood = true
            model.progress.Inventory = true
            model.progress.ResourceEnabled[ResourceType.Food] = true
        
            model.upgrades.addAvailableUpgrade("upgrade_manual_food")
            model.upgrades.addAvailableUpgrade("upgrade_manual_insight")
            model.upgrades.addAvailableUpgrade("gatherers")
            model.upgrades.addAvailableUpgrade("research_pack_primitive_2")            
        }
    },
    {
        id: "upgrade_manual_food",
        title: "Edible fruit",
        description: "Upgrade manual food collection speed",
        flavorText: "What if I ate this?",
        workCost: [insight(5)],
        onComplete: (model) => {
            model.manualCollection.collectFood.timeAcc.required = 0.5
        }
    },
    {
        id: "upgrade_manual_insight",
        title: "Bicameral mind",
        description: "Upgrade manual insight collection speed",
        flavorText: "...who is that? Is it.. me?",
        workCost: [insight(5)],
        onComplete: (model) => {
            model.manualCollection.collectInsight.timeAcc.required = 0.5
        }
    },
    {
        id: "gatherers",
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

            model.upgrades.addAvailableUpgrade("gatherer_upgrades")
        }
    },
    {
        id: "gatherer_upgrades",
        title: "Gatherer Upgrades Pack",
        type: UpgradeType.Pack,
        flavorText: "Gatherers could be more effective",
        timeCost: 3,
        initialCost: [food(15)],
        onComplete: (model) => {
            model.upgrades.addAvailableUpgrade("enable_idler_insight")
            model.upgrades.addAvailableUpgrade("increase_forests_1")
            model.upgrades.addAvailableUpgrade("gathering_duration_control")
            model.upgrades.addAvailableUpgrade("enable_idler_automation")
        }
    },
    {
        id: "enable_idler_insight",
        title: "Insightful Gatherers",
        description: "Enable Gatherer insight",
        flavorText: "Tell me what you saw",
        workCost: [insight(10)],
        onComplete: (model) => {
            model.population.idlers.definition.work.push(insight(0.1))
        }
    },
    {
        id: "increase_forests_1",
        title: "More forest",
        description: "Increase forests by 3",
        flavorText: "Let's try to go further this time",
        workCost: [insight(15)],
        onComplete: (model) => {
            model.resources.forest.add(3)
        }
    },
    {
        id: "gathering_duration_control",
        title: "Waterskins",
        description: "Control the duration of gathering trips",
        flavorText: "Drink up",
        workCost: [insight(15)],
        onComplete: (model) => {
            model.progress.GatheringDurationControlEnabled = true
        }
    },
    {
        id: "enable_idler_automation",
        title: "Authority",
        description: "Enable Gatherer automation",
        flavorText: "I don't care you're tired, keep going",
        workCost: [insight(20)],
        onComplete: (model) => {
            model.progress.GatheringAutomationEnabled = true
        }
    },
    {
        id: "research_pack_primitive_2",
        title: "Tribal Pack #2",
        type: UpgradeType.Pack,
        flavorText: "Tribe grows",
        description: "Enables additional tribal upgrades",
        timeCost: 3,
        initialCost: [resources(ResourceType.Food, 20)],
        onComplete: (model) => {
        
            model.upgrades.addAvailableUpgrade("upgrade_food_storage_1")
        }
    },
    {
        id: "upgrade_food_storage_1",
        title: "Basic food preservation",
        description: "Increase Food cap by 30",
        flavorText: "Smoke it, maaaan",
        workCost: [insight(20)],
        onComplete: (model) => {
            model.resources.food.cap!! += 30
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
  
