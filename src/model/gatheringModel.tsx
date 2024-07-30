import { GatheringMessages, HuntingMessages } from "../view/logMessages"
import { Action, action } from "./action"
import { Log } from "./log"
import { PopulationModel } from "./popModel"
import { PopType } from "./pops"
import { ResourceType } from "./resources"
import { ResourcesModel } from "./resourcesModel"
import { GameModel } from "./gameModel"

const GATHERING_DURATION = 10
const GATHERING_MULTIPLIER = 1

export class GatheringModel {

    log: Log
    population: PopulationModel
    resources: ResourcesModel

    gatherAction: Action

    constructor(population: PopulationModel, resources: ResourcesModel, log: Log) {
        this.log = log
        this.population = population
        this.resources = resources

        this.gatherAction = action({
            id: "gathering",
            exclusivityGroup: "gathering",
            timeCost: GATHERING_DURATION,
            expectedRewards: () => {
                return [{
                    type: ResourceType.Food,
                    assignment: false,
                    count: Math.ceil(Math.min(this.gatherersCount, this.forestCount) * GATHERING_MULTIPLIER),
                }]
            },
            disabled: (model: GameModel) => {
                return this.gatherersCount === 0 || this.forestCount === 0  
            },
            onComplete: (self: Action, model: GameModel) => {
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

