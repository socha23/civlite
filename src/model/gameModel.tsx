import { GameModelInterface } from "./action"
import { CostElem } from "./costs"
import { ResourceType } from "./resources"
import { PopulationModel } from "./popModel"
import { ResourcesModel } from "./resourcesModel"
import { onTick } from "./timer"
import MilitaryModel from "./militaryModel"
import CivilizationsModel from "./civsModel"

export class GameModel implements GameModelInterface {
  tick: number = 0
  civName: string = "The Tribe"
  resources = new ResourcesModel()
  population = new PopulationModel()
  civilizations = new CivilizationsModel()
  military = new MilitaryModel(this.population, this.civilizations)

  filterUnsatisfiableCosts(costs: CostElem[]): CostElem[] {
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
    this.military.onTick(deltaS)
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
