import { spawnEffectAwards, spawnEffectCost } from "../view/effects"
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
        case PopType.Gatherer: return 1
        case PopType.Farmer: return 1
        case PopType.Laborer: return 2
        case PopType.Idler: return 3
    }
}

export class HungerModel {
    log: Log
    population: PopulationModel
    resources: ResourcesModel

    constructor(population: PopulationModel, resources: ResourcesModel, log: Log) {
        this.log = log
        this.population = population
        this.resources = resources
    }

    feedPops(): PopAmount[] {
        const listInOrder = Object.values(PopType).sort((a, b) => feedOrder(a) - feedOrder(b))
        const loses = [] as PopAmount[]
        const food = this.resources.resource(ResourceType.Food)
        listInOrder.forEach(t => {
            const pop = this.population.pop(t)
            const peopleFed = pop.singlePopFoodConsumption > 0 
                ? Math.min(Math.floor(food.count / pop.singlePopFoodConsumption), pop.count) 
                : pop.count
            const foodConsumed = peopleFed * pop.singlePopFoodConsumption
            food.sub(foodConsumed)
            if (peopleFed < pop.count) {
                const hungerDeaths = pop.count - peopleFed
                pop.decCount(hungerDeaths)
                this.log.info(<HungerMessages.HungerDeaths type={t} count={hungerDeaths}/>)
                spawnEffectCost(coordsIdPopCount(t), [pops(t, -hungerDeaths)])
                loses.push(pops(t, hungerDeaths))
            }
        })
        return loses
    }
}

