import { ResourcesModel, ResourceType, resources } from "./resources"
import { Action, ActionParams, CostElem } from "./action"

function sum<T>(items: T[], op: (arg: T) => number) {
  let total = 0
  items.forEach(i => {
    total += op(i)
  })
  return total
}

interface PopType {
  foodProduction: number,
  buyCost: CostElem[]
}

export const PopTypes = {
  Gatherer: { 
    foodProduction: 1.01,     
    buyCost: [resources(ResourceType.Food, 5)]},
}

export class PopModel {

  type: PopType
  count: number = 0
  buyAction: BuyPopAction

  constructor(
    type: PopType,
    count: number) {
    this.buyAction = new BuyPopAction(this, { costs: type.buyCost })
    this.type = type
    this.count = count
  }

  onBuy() {
    this.count++
  }

  get foodProduction() {
    return this.count * this.type.foodProduction
  }

  get foodConsumption() {
    return this.count * CONSUMPTION_PER_POP
  }

}

const CONSUMPTION_PER_POP = 1

export class PopulationModel {

  gatherers = new PopModel(PopTypes.Gatherer, 10)

  pop(type: PopType): PopModel {
    switch (type) {
      case PopTypes.Gatherer:
        return this.gatherers
      default: throw `Can't find pop of type: ${type}`

    }
  }

  get allPops() {
    return [this.gatherers]
  }

  get foodSurplus() {
    return this.foodProduction - this.foodConsumption
  }

  get foodProduction() {
    return sum(this.allPops, p => p.foodProduction)
  }

  get foodConsumption() {
    return sum(this.allPops, p => p.foodConsumption)
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
