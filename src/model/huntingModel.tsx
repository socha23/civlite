import { spawnEffectNumberIncrease } from "../view/effects"
import { coordsIdHuntStock } from "../view/coordsCatcher"
import { HuntingMessages } from "../view/logMessages"
import { Action, action } from "./action"
import { ExpectedResourceAmount, resources } from "./amount"
import { Log } from "./log"
import { PopulationModel } from "./popModel"
import { PopType } from "./pops"
import { ResourceType } from "./resources"
import { ResourcesModel } from "./resourcesModel"
import { GameModel } from "./gameModel"
import { WorkType } from "./work"

export type AnimalType = ResourceType.WildAnimalsSmall | ResourceType.WildAnimalsBig
const AnimalTypes = [ResourceType.WildAnimalsSmall, ResourceType.WildAnimalsBig] as AnimalType[]


export interface AnimalStock {
    type: AnimalType,
    count: number,
    cap: number,
  }

const AnimalDefs = {
    [ResourceType.WildAnimalsSmall]: {
        capPerForest: 10,
        growthRate: 0.005,
    },
    [ResourceType.WildAnimalsBig]: {
        capPerForest: 5,
        growthRate: 0.002,
    },
}

export enum HuntType {
    Small = "Small",
    Large = "Large",
}

interface HuntDefinition {
    duration: number,
    // hunt will produce between 0 and huntingMultiplier * collectedWork food 
    huntingMultiplier: number,
    animalType: AnimalType,
}

const HuntTypes = {
    [HuntType.Small]: {
        duration: 2,
        huntingMultiplier: 1,
        animalType: ResourceType.WildAnimalsSmall as AnimalType
    },
    [HuntType.Large]: {
        duration: 5,
        huntingMultiplier: 1.2,
        animalType: ResourceType.WildAnimalsBig as AnimalType
    },
}

export class HuntingModel {

    log: Log
    population: PopulationModel
    resources: ResourcesModel

    smallHuntAction: Action
    largeHuntAction: Action

    constructor(population: PopulationModel, resources: ResourcesModel, log: Log) {
        this.log = log
        this.population = population
        this.resources = resources

        this.setCaps()

        this.fillForestsWithAnimals()
        

        this.smallHuntAction = this.createHuntAction(HuntTypes[HuntType.Small])
        this.largeHuntAction = this.createHuntAction(HuntTypes.Large)
    }

    fillForestsWithAnimals() {
        AnimalTypes.forEach(t => {
            this.resources.resource(t).count = this.resources.resource(t).cap!!
        })
    }

    get stocks(): AnimalStock[] {
        return AnimalTypes.map(t => ({
            type: t,
            count: this.resources.resource(t).count,
            cap: this.resources.resource(t).cap!!,
        }))
    }

    cap(t: AnimalType) {
        return this.resources.resource(ResourceType.Forest).count 
            * AnimalDefs[t].capPerForest
    }

    get huntersCount() {
        return this.population.pop(PopType.Hunter).count
    }

    animalCount(t: AnimalType) {
        return this.resources.resource(t).count
    }

    createHuntAction(type: HuntDefinition): Action {
        return action({
            id: "hunting" + type.animalType,
            exclusivityGroup: "hunting",
            timeCost: type.duration,
            collectedWork: [WorkType.Hunting],
            expectedRewards: () => {
                const hunters = this.huntersCount
                const animals = this.animalCount(type.animalType)
                return [{
                    type: ResourceType.Food,
                    from: 0,
                    to: Math.floor(Math.min(
                            hunters 
                            * this.population.pop(PopType.Hunter).singlePopWorkOfType(WorkType.Hunting) 
                            * type.duration 
                            * type.huntingMultiplier
                        , animals))
                }]
            },
            disabled: (model: GameModel) => {
                const hunters = model.hunting.huntersCount
                const animals = model.hunting.animalCount(type.animalType)
                return hunters === 0 || animals === 0  
            },
            onComplete: (self: Action, model: GameModel) => {
                const hunted = Math.floor(
                    Math.random() * Math.min(
                        model.hunting.animalCount(type.animalType), 
                        self.collectedWorkAcc.collected(WorkType.Hunting) * type.huntingMultiplier
                    ))
                self.actualRewards = [resources(ResourceType.Food, hunted)]
                this.log.info(<HuntingMessages.HuntComplete animalType={type.animalType} count={hunted}/>)
                this.resources.resource(type.animalType).sub(hunted)
            }
        })
    }

    setCaps() {
        AnimalTypes.forEach(t => {
            this.resources.resource(t).cap = this.cap(t)
        })
        
    }

    multiplyAnimals() {
        AnimalTypes.forEach(t => {
            const oldCount = this.animalCount(t)
            if (oldCount > 1) {                
                const growth = oldCount * AnimalDefs[t].growthRate
                this.resources.resource(t).add(growth)
 
                const added = Math.floor(this.resources.resource(t).count) - Math.floor(oldCount)
                if (added > 0) {
                    spawnEffectNumberIncrease(coordsIdHuntStock(t), added)
                }
            }
        })   
    }
}

