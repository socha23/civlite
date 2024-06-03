import { ActionCostChecker } from "./action"
import { CostElem } from "./costs"
import { ResourcesModel, ResourceType } from "./resources"
import { PopulationModel } from "./popModel"
import { onTick } from "./timer"

export class GameModel implements ActionCostChecker {
  tick: number = 0
  resources = new ResourcesModel()
  population = new PopulationModel()

  filterUnsatisfiableCosts(costs: CostElem[]): CostElem[] {
    const result: CostElem[] = []
    return this.resources.filterUnsatisfiableCosts(costs)
      .concat(this.population.filterUnsatisfiableCosts(costs))
  }

  payCosts(costs: CostElem[]) {
    this.resources.payCosts(costs)
    this.population.payCosts(costs)
  }

  onTick(deltaS: number) {
    this.tick += deltaS
    onTick(deltaS)
    this.applyProductionAndConsumption(deltaS)
  }

  production(resourceType: ResourceType): number {
    return this.population.production(resourceType)
  }

  consumption(resourceType: ResourceType): number {
    return this.population.consumption(resourceType)
  }


  applyProductionAndConsumption(deltaS: number) {
    this.population.allPops.forEach(pop => {
      pop.production.forEach(res => {
        this.resources.resource(res.type).onProduce(res.count * deltaS)
      })
      pop.consumption.forEach(res => {
        this.resources.resource(res.type).onConsume(res.count * deltaS)
      })
    })
  }
}
