import { spawnEffectAwards, spawnEffectNumberIncrease } from "../view/effects"
import { coordsIdHuntStock } from "../view/elementCoordinatesHolder"
import { HuntingMessages } from "../view/logMessages"
import { Action, action } from "./action"
import { ExpectedResourceAmount, Amount, } from "./amount"
import { Log } from "./log"
import { PopulationModel } from "./popModel"
import { PopType } from "./pops"
import { ResourceType } from "./resources"
import { ResourcesModel } from "./resourcesModel"

export enum AnimalType {
    Small = "SmallAnimals",
    Large = "LargeAnimals"
}

export interface AnimalStock {
    type: AnimalType,
    count: number,
    cap: number,
  }

const AnimalDefs = {
    [AnimalType.Small]: {
        capPerForest: 10,
        growthRate: 1.005,
    },
    [AnimalType.Large]: {
        capPerForest: 5,
        growthRate: 1.002,
    },
}

export enum HuntType {
    Small = "Small",
    Large = "Large",
}

interface HuntDefinition {
    duration: number,
    rewardsPerHunter: ExpectedResourceAmount[],
    animalType: AnimalType,
}

const HuntTypes = {
    [HuntType.Small]: {
        duration: 2,
        rewardsPerHunter: [{type: ResourceType.Food, from: 1, to: 2}],
        animalType: AnimalType.Small
    },
    [HuntType.Large]: {
        duration: 5,
        rewardsPerHunter: [{type: ResourceType.Food, from: 3, to: 5}],
        animalType: AnimalType.Large
    },
}

export class HuntingModel {
    animalCounts: Map<AnimalType, number> = new Map()

    log: Log
    population: PopulationModel
    resources: ResourcesModel

    smallHuntAction: Action
    largeHuntAction: Action

    constructor(population: PopulationModel, resources: ResourcesModel, log: Log) {
        this.log = log
        this.population = population
        this.resources = resources

        Object.values(AnimalType).forEach(t => {
            this.animalCounts.set(t, this.cap(t))
        })

        this.smallHuntAction = this.createHuntAction(HuntTypes[HuntType.Small])
        this.largeHuntAction = this.createHuntAction(HuntTypes.Large)
    }

    get stocks(): AnimalStock[] {
        return Object.values(AnimalType).map(t => ({
            type: t,
            count: this.animalCounts.get(t)!!,
            cap: this.cap(t),
        }))
    }

    cap(t: AnimalType) {
        return this.resources.resource(ResourceType.Forest).count 
            * AnimalDefs[t].capPerForest
    }

    createHuntAction(type: HuntDefinition): Action {
        const hunters = this.population.pop(PopType.Gatherer).count
        const animals = this.animalCounts.get(type.animalType)!!
        return action({
            id: "hunting" + type.animalType,
            exclusivityGroup: "hunting",
            timeCost: type.duration,
            rewards: type.rewardsPerHunter.map(r => ({
                type: r.type, 
                from: Math.floor(Math.min(r.from * hunters, animals)),
                to: Math.floor(Math.min(r.to * hunters, animals)),
            })),
            disabled() {
              return hunters === 0 || animals === 0  
            },
            onComplete: (rewards: Amount[]) => {
                let count = 0
                rewards.forEach(r => count += r.count)
                this.log.info(<HuntingMessages.HuntComplete animalType={type.animalType} count={count}/>)
                const currentAnimalCount = this.animalCounts.get(type.animalType)!!
                const newAnimalCount = Math.max(0, currentAnimalCount - count) 
                this.animalCounts.set(type.animalType, newAnimalCount)
            }
        })
    }

    onTick(deltaS: number) {
        if (!this.smallHuntAction.inProgress) {
            this.smallHuntAction = this.createHuntAction(HuntTypes.Small)
        }
        if (!this.largeHuntAction.inProgress) {
            this.largeHuntAction = this.createHuntAction(HuntTypes.Large)
        }

        this.applyCaps()
    }

    applyCaps() {
        return Object.values(AnimalType).forEach(t => {
            if ((this.animalCounts.get(t) || 0) > this.cap(t)) {
                this.animalCounts.set(t, this.cap(t))
            }
        })   
    }

    multiplyAnimals() {
        Object.values(AnimalType).forEach(t => {
            const count = this.animalCounts.get(t) || 0
            if (count > 1) {                
                const newCount = count * AnimalDefs[t].growthRate
                this.animalCounts.set(t, newCount)
                const added = Math.floor(newCount) - Math.floor(count)
                if (added > 0) {
                    spawnEffectNumberIncrease(coordsIdHuntStock(t), added)
                }
            }
        })   
    }
}

