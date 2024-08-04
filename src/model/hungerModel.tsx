import { spawnEffectCost } from "../view/effects"
import { coordsIdPopCount } from "../view/coordsCatcher"
import { HungerMessages } from "../view/logMessages"
import { PopAmount, pops, resources } from "./amount"
import { AudioModel } from "./audioModel"
import { Log } from "./log"
import { PopulationModel } from "./popModel"
import { PopType } from "./pops"
import { ResourceType } from "./resources"
import { ResourcesModel } from "./resourcesModel"

function feedOrder(t: PopType): number {
    switch (t) {
        case PopType.Brave:  return 0
        case PopType.Slinger: return 0
        case PopType.Herder: return 1
        case PopType.Hunter: return 1
        case PopType.Farmer: return 1
        case PopType.Laborer: return 2
        case PopType.Idler: return 3
    }
}
const HUNGER_DEATH_CHANCE = 0.5
export const TURNS_PER_FEEDING = 4

export class HungerModel {
    log: Log
    audio: AudioModel
    population: PopulationModel
    resources: ResourcesModel
    turnsSinceFeeding = 0

    constructor(population: PopulationModel, resources: ResourcesModel, log: Log, audio: AudioModel) {
        this.log = log
        this.audio = audio
        this.population = population
        this.resources = resources
    
    }

    get consumptionPerFeeding(): number {
        let total = 0
        Object.values(PopType).forEach(t => {
            const pop = this.population.pop(t)
            total += pop.singlePopFoodConsumption * pop.count
        })
        return total
    }

    get timeUntilHunger() {
        const currentFood = this.resources.food.count
        const consumption = this.consumptionPerFeeding
        if (currentFood === 0 || consumption === 0) {
            return 0
        }
        if (currentFood < consumption) {
            return TURNS_PER_FEEDING - this.turnsSinceFeeding
        } else {
            return Math.floor(TURNS_PER_FEEDING * currentFood / consumption) - this.turnsSinceFeeding
            
        }
   }

    simulateConsumption(): {
        foodConsumed: number,
        consumption: {type: PopType, value: number}[],
        hunger: PopAmount[]
    } {
        const listInOrder = Object.values(PopType).sort((a, b) => feedOrder(a) - feedOrder(b))
        const consumption: {type: PopType, value: number}[] = []
        let foodConsumed = 0
        let foodLeft = this.resources.resource(ResourceType.Food).count
        const hunger = [] as PopAmount[]
        listInOrder.forEach(t => {
            const pop = this.population.pop(t)
            const peopleFed = pop.singlePopFoodConsumption > 0 
                ? Math.min(Math.floor(foodLeft / pop.singlePopFoodConsumption), pop.count) 
                : pop.count
            const popConsumption = peopleFed * pop.singlePopFoodConsumption
            consumption.push({type: t, value: popConsumption})
            foodConsumed += popConsumption
            foodLeft -= popConsumption
            if (peopleFed < pop.count) {
                const hungerDeaths = pop.count - peopleFed
                hunger.push(pops(t, hungerDeaths))
            }
        })
        return {
            foodConsumed: foodConsumed,
            consumption: consumption,
            hunger: hunger
        }
    }

    onEndOfTurn() {
        this.turnsSinceFeeding++
        if (this.turnsSinceFeeding >= TURNS_PER_FEEDING) {
            this.feedPops()
            this.turnsSinceFeeding = 0
        }
    }

    feedPops() {
        const results = this.simulateConsumption()
        if (results.foodConsumed > 0) {
            this.audio.onFeed()
        }
        this.resources.resource(ResourceType.Food).sub(results.foodConsumed)
        results.hunger.forEach(d => {
            let deaths = 0
            for (let i = 0; i < d.count; i++) {
                if (Math.random() < HUNGER_DEATH_CHANCE) {
                    deaths++
                }
            }
            if (deaths > 0) {
                this.population.pop(d.type).decCount(deaths)
                this.log.info(<HungerMessages.HungerDeaths type={d.type} count={deaths}/>)
                spawnEffectCost(coordsIdPopCount(d.type), [pops(d.type, -deaths)])    
            }
        })
        results.consumption.forEach(c => {
            if (c.value > 0) {
                spawnEffectCost(coordsIdPopCount(c.type), [resources(ResourceType.Food, -c.value)])
            }
        })
    }

    get foodConsumptionPerSeason() : {
        type: PopType,
        count: number
    }[] {
        const listInOrder = Object.values(PopType).sort((a, b) => feedOrder(a) - feedOrder(b))
        return listInOrder.map(t => {
            const pop = this.population.pop(t)
            return {
                type: t,
                count: pop.singlePopFoodConsumption * pop.count
            }
        }).filter(c => c.count !== 0)
    }
}

