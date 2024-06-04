import { ResourceType,  } from "./resources"
import { Action, action } from "./action"
import { sum } from './utils'
import { PopTypeDefinitions, PopType } from "./pops"
import { CostElem, Pops, Resources, resources } from "./costs"

class PopModel {

  type: PopType
  count: number = 0
  assignAction: Action
  unassignAction: Action

  constructor(type: PopType) {
    this.assignAction = action({
      costs: PopTypeDefinitions[type].buyCost,
      action: () => {this.count++}
    })
    this.unassignAction = action({
      gains: PopTypeDefinitions[type].sellValue,
      action: () => {this.count--},
      disabled: () => this.count === 0
    })

    this.type = type
    this.count = PopTypeDefinitions[type].initialCount
  }

  get definition() {
    return PopTypeDefinitions[this.type]
  }

  onAssign() {
    this.count++
  }

  onUnassign() {
    this.count++
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
            this.pop(c.type).count -= c.count
        }
    })
  }

  onProduce(costs: CostElem[]) {
    costs.forEach(c => {
        if (c instanceof Pops) {
            this.pop(c.type).count += c.count
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
