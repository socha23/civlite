import { Colors, Labels } from "../view/icons"
import { Action, action } from "./action"
import { Assignable } from "./assignable"
import { Force } from "./battleModel"
import { PopulationModel, PopModel } from "./popModel"
import { popTypesAssignableToArmy, PopType } from "./pops"
import { War } from "./warModel"

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
    
export class ArmyModel extends Assignable {    
    title: string
    elements: ArmyElementModel[]
    population: PopulationModel
    engagedIn?: War

    constructor(title: string, population: PopulationModel) {
        super(popTypesAssignableToArmy())
        this.population = population
        this.title = title
        this.elements = popTypesAssignableToArmy().map(t => new ArmyElementModel(population.pop(t), this))
    }

    get locked() {
        return this.engagedIn !== undefined
    }

    force() {
        return new Force(
            this.title, Colors.OurArmy, this.elements
            .filter(e => this.population.pop(e.type).assignedCount(this) > 0)
            .map(e => ({
                type: e.type,
                count: this.population.pop(e.type).assignedCount(this)
        })))
    }

    onTick(deltaS: number) {
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

    attackingArmy() {
        return this.armies[0]
    }
}