import { GameModelInterface } from "./action"
import { CostElem } from "./costs"
import { ResourceType } from "./resources"
import { PopulationModel } from "./popModel"
import { ResourcesModel } from "./resourcesModel"
import { onTick } from "./timer"

export class GameModel implements GameModelInterface {
  tick: number = 0
  civName: string = "The Tribe"
  resources = new ResourcesModel()
  population = new PopulationModel()

  filterUnsatisfiableCosts(costs: CostElem[]): CostElem[] {
    const result: CostElem[] = []
    return this.resources.filterUnsatisfiableCosts(costs)
      .concat(this.population.filterUnsatisfiableCosts(costs))
  }

  onConsume(costs: CostElem[]) {
    this.resources.onConsume(costs)
    this.population.onConsume(costs)
  }

  onProduce(value: CostElem[]) {
    this.resources.onProduce(value)
    this.population.onProduce(value)
  }

  canPay(elem: CostElem) {
    return this.resources.filterUnsatisfiableCosts([elem]).length === 0
      && this.population.filterUnsatisfiableCosts([elem]).length === 0
  }

  onTick(deltaS: number) {
    this.tick += deltaS
    onTick(deltaS)
    this.applyConsumptionAndProduction(deltaS)
  }

  production(resourceType: ResourceType): number {
    return this.population.production(resourceType)
  }

  consumption(resourceType: ResourceType): number {
    return this.population.consumption(resourceType)
  }

  applyConsumptionAndProduction(deltaS: number) {
    this.population.pops.forEach(pop => {
      pop.consumption.forEach(res => {
        this.resources.resource(res.type).onConsume(res.count * deltaS)
      })
      pop.production.forEach(res => {
        this.resources.resource(res.type).onProduce(res.count * deltaS)
      })
    })
  }
}
