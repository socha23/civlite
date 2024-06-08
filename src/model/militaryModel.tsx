import { Labels } from "../view/icons"
import { Action, action } from "./action"
import { Assignable } from "./assignable"
import { PopulationModel, PopModel } from "./popModel"
import { popTypesAssignableToArmy, PopType } from "./pops"

class ArmyElementModel {
    type: PopType
    assignAction: Action
    unassignAction: Action

    constructor(popModel: PopModel, army: ArmyModel) {
        this.type = popModel.type

        this.assignAction = action({
            action: () => {popModel.assign(army)},
            disabled: () => {
                if (army.locked) {
                    return "Army locked"
                }
                return popModel.assignDisabled()
            },
        })
        this.unassignAction = action({
            action: () => {popModel.unassign(army)},
            disabled: () => {
                if (army.locked) {
                    return "Army locked"
                }
                return popModel.unassignDisabled(army)
            },
        })
    }
}


interface WarParams {
    duration: number
}

export enum WarState {
    InProgress,
    Resolved,
    Completed
}

class War {
    duration: number
    durationLeft: number
    state: WarState = WarState.InProgress
    army: ArmyModel
    completeAction: Action

    constructor(p: WarParams, army: ArmyModel) {
        this.duration = p.duration
        this.durationLeft = this.duration
        this.army = army
        this.completeAction = action({
            action: () => {
                this.state = WarState.Completed
                this.army.onWarCompleted()    
            },
            disabled: () => {
                if (this.state !== WarState.Resolved) {
                    return "War not yet resolved"
                }
            }
        })
    }

    onTick(deltaS: number) {
        this.durationLeft = Math.max(0, this.durationLeft - deltaS)
        if (this.state === WarState.InProgress && this.durationLeft === 0) {
            this.onResolved()
        }
    }

    onResolved() {
        this.state = WarState.Resolved
    }

    onCompleted() {
        this.state = WarState.Completed
    }

}


export class ArmyModel extends Assignable {    
    title: string
    elements: ArmyElementModel[]

    startWarAction: Action

    war?: War

    constructor(title: string, population: PopulationModel) {
        super(popTypesAssignableToArmy())
        this.title = title
        this.elements = popTypesAssignableToArmy().map(t => new ArmyElementModel(population.pop(t), this))

        this.startWarAction = action({
            action: () => this.startWar(),
            disabled: () => {
                if (this.war) {
                    return "War already in progress"
                }
            }
        })
    }

    get locked() {
        return this.war !== undefined
    }

    onTick(deltaS: number) {
        if (this.war) {
            this.war.onTick(deltaS)
        }
    }

    startWar() {
        this.war = new War({duration: 10}, this)
    }

    onWarCompleted() {
        this.war = undefined
    }


}


export default class MilitaryModel {
    armies: ArmyModel[]
    population: PopulationModel

    constructor(population: PopulationModel) {
        this.armies = [new ArmyModel(Labels.WarParty, population)]
        this.population = population
    }

    onTick(deltaS: number) {
        this.armies.forEach(a => {
            a.onTick(deltaS)
        })
    }

}