import { Colors, Labels } from "../view/icons"
import { Action, action } from "./action"
import { Assignable } from "./assignable"
import { Force } from "./battleModel"
import { PopulationModel, PopModel } from "./popModel"
import { popTypesAssignableToArmy, PopType, popTypeDefinition } from "./pops"
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

    get popTypesPresentInArmy() {
        return this.elements
            .filter(e => this.count(e.type) > 0)
            .map(e => e.type)
    }

    count(t: PopType) {
        return this.population.pop(t).assignedCount(this)
    }

    get marchDuration() {
        let result = 0
        this.popTypesPresentInArmy.forEach(type => {
            result = Math.max(result, popTypeDefinition(type).marchDuration)
        })
        return result
    }

    force() {
        return new Force(
            this.title, Colors.OurArmy, this.elements
            .filter(e => this.count(e.type) > 0)
            .map(e => ({
                type: e.type,
                count: this.count(e.type)
        })))
    }
}


export default class MilitaryModel {
    armies: ArmyModel[]
    population: PopulationModel

    constructor(population: PopulationModel) {
        this.armies = [new ArmyModel(Labels.WarParty, population)]
        this.population = population
    }

    attackingArmy() {
        return this.armies[0]
    }
}