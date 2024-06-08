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
            disabled: () => !popModel.canAssign(),
        })
        this.unassignAction = action({
            action: () => {popModel.unassign(army)},
            disabled: () => !army.canUnassign(popModel.type),
        })
    }
}

export class ArmyModel extends Assignable {    
    title: string
    elements: ArmyElementModel[]

    constructor(title: string, population: PopulationModel) {
        super(popTypesAssignableToArmy())
        this.title = title
        this.elements = popTypesAssignableToArmy().map(t => new ArmyElementModel(population.pop(t), this))
    }
}


export default class MilitaryModel {
    armies: ArmyModel[]
    population: PopulationModel

    constructor(population: PopulationModel) {
        this.armies = [new ArmyModel(Labels.WarParty, population)]
        this.population = population
    }
}