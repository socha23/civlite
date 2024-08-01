import { spawnEffectCost } from "../view/effects"
import { coordsIdPopCount } from "../view/elementCoordinatesHolder"
import { HungerMessages } from "../view/logMessages"
import { PopAmount, pops } from "./amount"
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
const TURNS_PER_FEEDING = 5

export class HungerModel {
    log: Log
    population: PopulationModel
    resources: ResourcesModel
    turnsSinceFeeding = 0

    constructor(population: PopulationModel, resources: ResourcesModel, log: Log) {
        this.log = log
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
        if (currentFood === 0 || this.consumptionPerFeeding === 0) {
            return 0
        }
        return Math.floor(currentFood / this.consumptionPerFeeding) * TURNS_PER_FEEDING 
            + (TURNS_PER_FEEDING - this.turnsSinceFeeding)
    }

    simulateConsumption(): {
        foodConsumed: number,
        hungerDeaths: PopAmount[]
    } {
        const listInOrder = Object.values(PopType).sort((a, b) => feedOrder(a) - feedOrder(b))
        let foodConsumed = 0
        let foodLeft = this.resources.resource(ResourceType.Food).count
        const deaths = [] as PopAmount[]
        listInOrder.forEach(t => {
            const pop = this.population.pop(t)
            const peopleFed = pop.singlePopFoodConsumption > 0 
                ? Math.min(Math.floor(foodLeft / pop.singlePopFoodConsumption), pop.count) 
                : pop.count
            foodConsumed += peopleFed * pop.singlePopFoodConsumption
            foodLeft -= peopleFed * pop.singlePopFoodConsumption
            if (peopleFed < pop.count) {
                const hungerDeaths = pop.count - peopleFed
                deaths.push(pops(t, hungerDeaths))
            }
        })
        return {
            foodConsumed: foodConsumed,
            hungerDeaths: deaths
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
        this.resources.resource(ResourceType.Food).sub(results.foodConsumed)
        results.hungerDeaths.forEach(d => {
            let deaths = 0
            for (let i = 0; i < d.count; i++) {
                if (Math.random() < HUNGER_DEATH_CHANCE) {
                    deaths++
                }
            }
            this.population.pop(d.type).decCount(deaths)
            this.log.info(<HungerMessages.HungerDeaths type={d.type} count={deaths}/>)
            spawnEffectCost(coordsIdPopCount(d.type), [pops(d.type, -deaths)])
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

