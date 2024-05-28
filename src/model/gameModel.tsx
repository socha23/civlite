import {TestModel} from './testModel'


interface PopType {
  foodProduction: number
}

export const PopTypes = {
  Gatherer: {foodProduction: 1.1},
}

export class PopModel {
  
  count: number = 0  
  type: PopType

  constructor(type: PopType, count: number = 0) {
    this.type = type
    this.count = count
  }
}

export class PopulationModel {
  pops = [
    new PopModel(PopTypes.Gatherer, 10)
  ]

  pop(type: PopType): PopModel {
    const pop = this.pops.find(p => p.type == type)
    if (!pop) {
      throw `Can't find pop of type: ${type}`
    } else {
      return pop
    }
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
      total += pop.count
    })
    return total
  }
}


export class ResourceModel {  
  count: number = 0  
}

export class ResourcesModel {
  food = new ResourceModel()
}




export class GameModel {
  tick: number = 0
  population = new PopulationModel()
  resources = new ResourcesModel()

  test: TestModel =  new TestModel()

  onTick(deltaS: number) {
    this.test.onTick(deltaS)    
    this.tick += deltaS

    this.applyFood(deltaS)
 }

 applyFood(deltaS: number) {
  this.resources.food.count += 
    (this.population.foodProduction - this.population.foodConsumption) * deltaS
 }



}
