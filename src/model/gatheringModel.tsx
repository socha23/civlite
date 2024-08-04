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
import { CalendarModel } from "./calendarModel"
import { Season } from "./calendarConsts"
import { SoundType } from "../view/sounds"

const GATHERING_DURATION = 2
const GATHERING_WORK_FOR_FOOD = 2

export type GatheringActionStats = {
    gatherersCount: number
    gatheringDuration: number
    totalWork: number
    workPerFood: number
    uncappedFood: number

    forestCount: number
    forestCapPerForest: number
    forestCap: number

    season: Season
    seasonalMultiplier: number

    totalFood: number 
}


export class GatheringModel {

    log: Log
    population: PopulationModel
    resources: ResourcesModel
    calendar: CalendarModel

    gatherAction: Action

    constructor(population: PopulationModel, resourcesM: ResourcesModel, calendar: CalendarModel, log: Log) {
        this.log = log
        this.population = population
        this.resources = resourcesM
        this.calendar = calendar

        this.gatherAction = action({
            id: "gathering",
            exclusivityGroup: "gathering",
            timeCost: GATHERING_DURATION,
            collectedWork: [WorkType.Gathering],
            soundOnComplete: SoundType.CollectFood,
            expectedRewards: () => {
                return [{
                    type: ResourceType.Food,
                    assignment: false,
                    count: this.totalExpectedFood
                }]
            },
            disabled: (model: GameModel) => {
                return this.gatherersCount === 0 || this.forestCount === 0  
            },
            onComplete: (self: Action, model: GameModel) => {
                
                const uncapped =  self.collectedWorkAcc.collected(WorkType.Gathering) / GATHERING_WORK_FOR_FOOD
                const capped = Math.min(uncapped, this.forestCap)
                const multiplied = Math.floor(capped * this.seasonalMultiplier)
                
                const collected = multiplied
                self.actualRewards = [resources(ResourceType.Food, collected)]
                this.log.info(<GatheringMessages.GatheringComplete count={self.actualRewards[0].count}/>)
            }
        })
    }

    get baseFoodPerGatherer() {
        return 
    }

    get workPerGatherer() {
        return  this.population.pop(PopType.Idler).singlePopWorkOfType(WorkType.Gathering) 
    }

    get gatherersCount() {
        return this.population.pop(PopType.Idler).count
    }

    get forestCount() {
        return this.resources.resource(ResourceType.Forest).count
    }

    get forestCapPerForest() {
        return 1
    }

    get forestCap() {
        return this.forestCount * this.forestCapPerForest
    }

    get seasonalMultiplier() {
        switch (this.calendar.currentSeason) {
            case Season.Spring: return 1
            case Season.Summer: return 1.25
            case Season.Autumn: return 1.5
            case Season.Winter: return 0.5
        }
    }

    get expectedUncapped() {
        return this.gatherersCount * GATHERING_DURATION * this.workPerGatherer / GATHERING_WORK_FOR_FOOD
    }

    get totalExpectedFood() {
        const uncapped =  this.expectedUncapped
        const capped = Math.min(uncapped, this.forestCap)
        const multiplied = Math.floor(capped * this.seasonalMultiplier)
        return multiplied
    }

    get gatheringStats(): GatheringActionStats {
        return {
            gatherersCount: this.gatherersCount,
            gatheringDuration: GATHERING_DURATION,
            totalWork: this.gatherersCount * GATHERING_DURATION * this.workPerGatherer,
            workPerFood: GATHERING_WORK_FOR_FOOD,
            uncappedFood: this.expectedUncapped,
            forestCount: this.forestCount,
            forestCapPerForest: this.forestCapPerForest,
            forestCap: this.forestCap,
            seasonalMultiplier: this.seasonalMultiplier,
            totalFood: this.totalExpectedFood, 
            season: this.calendar.currentSeason,           
        }
    }
}

