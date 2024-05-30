import { ResourceType, Resources, resources } from "./resources"
import { Action, ActionParams, CostElem } from "./action"
import {sum } from './utils'

export enum PopType {
  Gatherer, Laborer
}

class Pops implements CostElem {
  type: PopType
  count: number

  constructor(type: PopType, count: number) {
    this.type = type
    this.count = count
  }
}

export function pops(type: PopType, count: number) {
  return new Pops(type, count)
}

const POP_TYPE_DEFINITIONS = {
  [PopType.Gatherer]: {
    buyCost: [resources(ResourceType.Food, 5)],
    production: [
      resources(ResourceType.Food, 1.02)
    ],
    consumption: [
      resources(ResourceType.Food, 1)
    ]  
  },
  [PopType.Laborer]: {
    buyCost: [
      resources(ResourceType.Food, 5),
      pops(PopType.Gatherer, 1)
      ],
    production: [
      resources(ResourceType.Labor, 1)
    ],
    consumption: [
      resources(ResourceType.Food, 1)
    ]  
  },
}


class PopModel {

  type: PopType
  count: number = 0
  buyAction: BuyPopAction

  constructor(type: PopType, count: number = 0) {
    this.buyAction = new BuyPopAction(this, { costs: POP_TYPE_DEFINITIONS[type].buyCost })
    this.type = type
    this.count = count
  }

  get definition() {
    return POP_TYPE_DEFINITIONS[this.type]
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

  gatherers = new PopModel(PopType.Gatherer, 10)
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
