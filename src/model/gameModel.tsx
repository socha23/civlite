interface PopType {
  foodProduction: number
}

export const PopTypes = {
  Gatherer: {foodProduction: 1.01},
}

export class PopModel {
  
  count: number = 0  
  type: PopType

  constructor(type: PopType, count: number = 0) {
    this.type = type
    this.count = count
  }
}

const CONSUMPTION_PER_POP = 1

export class PopulationModel {
  
  resources: ResourcesModel
  pops = [
    new PopModel(PopTypes.Gatherer, 10)
  ]

  constructor(resources: ResourcesModel) {
    this.resources = resources
  }

  pop(type: PopType): PopModel {
    const pop = this.pops.find(p => p.type == type)
    if (!pop) {
      throw `Can't find pop of type: ${type}`
    } else {
      return pop
    }
  }

  canBuyPop(type: PopType) {
    return this.foodSurplus + type.foodProduction - CONSUMPTION_PER_POP >= 0 
  }

  onBuy(type: PopType) {
    this.pop(type).count++
  }

  buyPopAction(type: PopType): BuyPopAction {
    return new BuyPopAction(this, type, {})
  }

  get foodSurplus() {
    return this.foodProduction - this.foodConsumption
  }

  get foodProduction() {
    let total = 0
    this.pops.forEach(pop => {
      total += pop.type.foodProduction * pop.count
    })
    return total
  }

  get foodConsumption() {
    let total = 0
    this.pops.forEach(pop => {
      total += pop.count * CONSUMPTION_PER_POP
    })
    return total
  }
}


export class ResourceModel {  
  count: number = 0  
  
  onPlayerProduction() {
    this.count += 1
  }
}

export class ResourcesModel {
  food = new ResourceModel()
}


type ActionParams = {
  timeout?: number,
}


export abstract class Action {  
  timeout?: number
  timeoutLeft: number = 0

  constructor(params: ActionParams) {
    this.timeout = params.timeout
  }

  abstract _onAction(): void

  onAction() {
    if (this.timeoutLeft > 0) {
      return
    }
    this._onAction()
    if (this.timeout) {
      this.timeoutLeft = this.timeout
    }
  }

  onTick(deltaS: number) {
    this.timeoutLeft = Math.max(0, this.timeoutLeft - deltaS)
  }

  get disabled() {
    return false
  }
}

class GatherResourceAction extends Action {  
  resource: ResourceModel
  
  constructor(resource: ResourceModel, params: ActionParams) {
    super(params)
    this.resource = resource
  }

  _onAction() {
    this.resource.onPlayerProduction()
  }
}

class BuyPopAction extends Action {  
  population: PopulationModel
  type: PopType
  
  constructor(population: PopulationModel, type: PopType, params: ActionParams) {
    super(params)
    this.population = population
    this.type = type
  }

  _onAction() {
    this.population.onBuy(this.type)
  }

  get disabled() {
    return !this.population.canBuyPop(this.type)
  }
}


export class ActionsModel {
  gatherFood: GatherResourceAction

  constructor(resources: ResourcesModel) {
    this.gatherFood = new GatherResourceAction(resources.food, {timeout: 1})
  }

  onTick(deltaS: number) {
    this.gatherFood.onTick(deltaS)
  }
}


export class GameModel {
  tick: number = 0
  resources = new ResourcesModel()
  population = new PopulationModel(this.resources)
  actions = new ActionsModel(this.resources)

  onTick(deltaS: number) {
    this.tick += deltaS

    this.actions.onTick(deltaS)

    this.applyFood(deltaS)
 }

 applyFood(deltaS: number) {
  this.resources.food.count += 
    (this.population.foodProduction - this.population.foodConsumption) * deltaS
 }



}
