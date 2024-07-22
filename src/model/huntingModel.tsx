import { Action, action } from "./action"
import { ExpectedAmount, ExpectedResourceAmount, Amount, PopAmount, pops } from "./amount"
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
        capPerForest: 20,
    },
    [AnimalType.Large]: {
        capPerForest: 10,
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
        duration: 5,
        rewardsPerHunter: [{type: ResourceType.Food, from: 1, to: 2}],
        animalType: AnimalType.Small
    },
    [HuntType.Large]: {
        duration: 10,
        rewardsPerHunter: [{type: ResourceType.Food, from: 3, to: 6}],
        animalType: AnimalType.Large
    },
}

export class HuntingModel {
    animalCounts: Map<AnimalType, number> = new Map()

    population: PopulationModel
    resources: ResourcesModel

    smallHuntAction: Action
    largeHuntAction: Action

    constructor(population: PopulationModel, resources: ResourcesModel) {
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
            exclusivityGroup: "hunting",
            timeCost: type.duration,
            rewards: type.rewardsPerHunter.map(r => ({
                type: r.type, 
                from: Math.min(r.from * hunters, animals),
                to: Math.min(r.to * hunters, animals),
            })),
            disabled() {
              return hunters === 0 || animals === 0  
            },
            onComplete: (rewards: Amount[]) => {
                let count = 0
                rewards.forEach(r => count += r.count)
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

    }
}

