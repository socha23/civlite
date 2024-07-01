import { GameModelInterface } from "./action"
import { Amount } from "./costs"
import { ResourceType } from "./resources"
import { PopulationModel } from "./popModel"
import { ResourcesModel } from "./resourcesModel"
import { onTick } from "./timer"
import MilitaryModel from "./militaryModel"
import CivilizationsModel from "./civsModel"
import { WarModel } from "./warModel"

export class GameModel implements GameModelInterface {
  tick: number = 0
  civName: string = "The Tribe"
  resources = new ResourcesModel()
  population = new PopulationModel()
  military = new MilitaryModel(this.population)
  civilizations = new CivilizationsModel()
  wars = new WarModel(this)

  filterUnsatisfiableCosts(costs: Amount[]): Amount[] {
    return this.resources.filterUnsatisfiableCosts(costs)
      .concat(this.population.filterUnsatisfiableCosts(costs))
  }

  onConsume(costs: Amount[]) {
    this.resources.pay(costs)
    this.population.onConsume(costs)
  }

  onProduce(value: Amount[]) {
    this.resources.gain(value)
    this.population.onProduce(value)
  }

  canPay(elem: Amount) {
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
        this.resources.resource(res.resourceType).sub(res.count * deltaS)
      })
      pop.production.forEach(res => {
        this.resources.resource(res.resourceType).add(res.count * deltaS)
      })
    })
  }
}
