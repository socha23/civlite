import { ResourceType,  } from "./resources"
import { Action, action } from "./action"
import { sum } from './utils'
import { popTypeDefinition, PopType } from "./pops"
import { CostElem, Pops, Resources, resources } from "./costs"
import { Assignable } from "./assignable"

export class PopModel {

  type: PopType
  _count: number = 0
  buyAction: Action
  sellAction: Action
  _assignables: Set<Assignable> = new Set()

  constructor(type: PopType) {
    this.buyAction = action({
      costs: popTypeDefinition(type).buyCost,
      action: () => {this.incCount(1)}
    })
    this.sellAction = action({
      gains: popTypeDefinition(type).sellValue,
      action: () => {this.decCount(1)},
      disabled: () => this.decCountDisabled(1)
    })

    this.type = type
    this._count = popTypeDefinition(type).initialCount
  }

  get count() {
    return this._count
  }

  get definition() {
    return popTypeDefinition(this.type)
  }

  get singlePopProduction(): Resources[] {
    return this.definition.production.map(r => resources(r.type, r.count))
  }

  get production(): Resources[] {
    return this.singlePopProduction.map(r => resources(r.type, r.count * this.count))
  }

  get singlePopConsumption(): Resources[] {
    return this.definition.consumption.map(r => resources(r.type, r.count))
  }

  get consumption(): Resources[] {
    return this.singlePopConsumption.map(r => resources(r.type, r.count * this.count))
  }

  get singlePopBalance(): Resources[] {
    return this.singlePopConsumption.map(r => resources(r.type, -r.count))
    .concat(this.singlePopProduction)
    .filter(c => c.count !== 0)
  }

  get resourceBalance(): Resources[] {
    return this.consumption.map(r => resources(r.type, -r.count))
    .concat(this.production)
    .filter(c => c.count !== 0)
  }

  get unassignedCount() {
    let all = this.count
    this._assignables.forEach(a => {
      all -= a.assignedCount(this.type)
    })
    return all
  }

  assignedCount(to: Assignable): number {
    return to.assignedCount(this.type)
  }

  assign(to: Assignable) {
    this._assignables.add(to)
    if (this.unassignedCount === 0) {
      throw `No unassigned pops of type ${this.type}`
    }
    to.assign(this.type)
  }

  assignDisabled() {
    if (this.unassignedCount === 0) {
      return `No unassigned ${this.type}`
    } 
  }

  unassign(to: Assignable) {
    to.unassign(this.type, 1)
  }

  unassignDisabled(to: Assignable) {
    return to.unassignDisabled(this.type)
  }

  incCount(howMuch: number) {
    this._count += howMuch
  }

  decCountDisabled(howMuch: number) {
    let decreasable = this.count
    this._assignables.forEach((a => {
      if (a.locked) {
        decreasable -= a.assignedCount(this.type)
      }
    }))
    if (decreasable < howMuch) {
      return `${this.type} too low`
    }
  }

  decCount(howMuch: number) {
    let leftToUnassign = howMuch
    leftToUnassign = Math.max(0, leftToUnassign - this.unassignedCount)
    if (leftToUnassign > 0) {
      this._assignables.forEach(a => {
        if (!a.locked) {
          const numberToUnassign = Math.min(a.assignedCount(this.type), leftToUnassign)
          a.unassign(this.type, numberToUnassign)
          leftToUnassign -= numberToUnassign
        }
      })
    }
    this._count -= howMuch
  }
}


export class PopulationModel {

  pops = Object.values(PopType).map(type => new PopModel(PopType[type]))

  pop(type: PopType): PopModel {
    return this.pops.find(m => m.type === type)!
  }

  filterUnsatisfiableCosts(costs: CostElem[]): CostElem[] {
    return costs.filter(c => (c instanceof Pops) &&
        c.count > this.pop(c.type).count
    )
  }

  onConsume(costs: CostElem[]) {
    costs.forEach(c => {
        if (c instanceof Pops) {
            this.pop(c.type).decCount(c.count)
        }
    })
  }

  onProduce(costs: CostElem[]) {
    costs.forEach(c => {
        if (c instanceof Pops) {
            this.pop(c.type).incCount(c.count)
        }
    })
  }

  production(resourceType: ResourceType): number {
    return sum(this.pops, pop =>
      sum(pop.production.filter(p => p.type === resourceType), r => r.count)
    )
  }

  consumption(resourceType: ResourceType): number {
    return sum(this.pops, pop =>
      sum(pop.consumption.filter(p => p.type === resourceType), r => r.count)
    )
  }

  get total() {
    return sum(this.pops, pop => pop.count)
  }

}
