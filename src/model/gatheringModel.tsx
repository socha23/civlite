import { GatheringMessages, HuntingMessages } from "../view/logMessages"
import { Action, action } from "./action"
import { Log } from "./log"
import { PopulationModel } from "./popModel"
import {resources } from "./amount"
import { PopType } from "./pops"
import { ResourceType } from "./resources"
import { ResourcesModel } from "./resourcesModel"
import { GameModel } from "./gameModel"
import { WorkType } from "./work"

const GATHERING_DURATION = 10
const GATHERING_WORK_FOR_FOOD = 10

const GATHERING_MULTIPLIER = 1


export class GatheringModel {

    log: Log
    population: PopulationModel
    resources: ResourcesModel

    gatherAction: Action

    constructor(population: PopulationModel, resourcesM: ResourcesModel, log: Log) {
        this.log = log
        this.population = population
        this.resources = resourcesM

        this.gatherAction = action({
            id: "gathering",
            exclusivityGroup: "gathering",
            timeCost: GATHERING_DURATION,
            collectedWork: [WorkType.Gathering],
            expectedRewards: () => {
                return [{
                    type: ResourceType.Food,
                    assignment: false,
                    count: Math.min(
                            Math.round(this.gatherersCount * GATHERING_MULTIPLIER * GATHERING_DURATION / GATHERING_WORK_FOR_FOOD),
                            Math.round(this.forestCount * GATHERING_MULTIPLIER)
                    )
                }]
            },
            disabled: (model: GameModel) => {
                return this.gatherersCount === 0 || this.forestCount === 0  
            },
            onComplete: (self: Action, model: GameModel) => {
                const collected = Math.min(
                    Math.round(self.collectedWorkAcc.collected(WorkType.Gathering) / GATHERING_WORK_FOR_FOOD * GATHERING_MULTIPLIER),
                    Math.round(this.forestCount * GATHERING_MULTIPLIER)
            )
            self.actualRewards = [resources(ResourceType.Food, collected)]
            this.log.info(<GatheringMessages.GatheringComplete count={self.actualRewards[0].count}/>)
            }
        })
    }

    get gatherersCount() {
        return this.population.pop(PopType.Idler).count
    }

    get forestCount() {
        return this.resources.resource(ResourceType.Forest).count
    }
}

