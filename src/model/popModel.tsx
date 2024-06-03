import { ResourceType,  } from "./resources"
import { Action, ActionParams } from "./action"
import { sum } from './utils'
import { PopTypeDefinitions, PopType } from "./pops"
import { CostElem, Pops, Resources, resources } from "./costs"

class PopModel {

  type: PopType
  count: number = 0
  buyAction: BuyPopAction

  constructor(type: PopType) {
    this.buyAction = new BuyPopAction(this, { costs: PopTypeDefinitions[type].buyCost })
    this.type = type
    this.count = PopTypeDefinitions[type].initialCount
  }

  get definition() {
    return PopTypeDefinitions[this.type]
  }

  onBuy() {
    this.count++
  }

  get production(): Resources[] {
    return this.definition.production.map(r => resources(r.type, r.count * this.count))
  }

  get consumption(): Resources[] {
    return this.definition.consumption.map(r => resources(r.type, r.count * this.count))
  }

}

export class PopulationModel {

  gatherers = new PopModel(PopType.Gatherer)
  laborers = new PopModel(PopType.Laborer)

  pop(type: PopType): PopModel {
    switch (type) {
      case PopType.Gatherer:
        return this.gatherers
      case PopType.Laborer:
        return this.laborers
      default: throw `Can't find pop of type: ${type}`

    }
  }

  get allPops() {
    return [this.gatherers, this.laborers]
  }

  filterUnsatisfiableCosts(costs: CostElem[]): CostElem[] {
    return costs.filter(c => (c instanceof Pops) &&
        c.count > this.pop(c.type).count
    )
  }

  payCosts(costs: CostElem[]) {
    costs.forEach(c => {
        if (c instanceof Pops) {
            this.pop(c.type).count -= c.count
        }
    })
  }

  production(resourceType: ResourceType): number {
    return sum(this.allPops, pop =>
      sum(pop.production.filter(p => p.type === resourceType), r => r.count)
    )
  }

  consumption(resourceType: ResourceType): number {
    return sum(this.allPops, pop =>
      sum(pop.consumption.filter(p => p.type === resourceType), r => r.count)
    )
  }
}

class BuyPopAction extends Action {
  model: PopModel

  constructor(model: PopModel, params: ActionParams) {
    super(params)
    this.model = model
  }

  _onAction() {
    this.model.onBuy()
  }
}
