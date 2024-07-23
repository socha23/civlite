import { GameModelInterface } from "./action"
import { Amount } from "./amount"
import { ResourceType } from "./resources"
import { PopulationModel } from "./popModel"
import { ResourcesModel } from "./resourcesModel"
import { onTick } from "./timer"
import MilitaryModel from "./militaryModel"
import CivilizationsModel from "./civsModel"
import { WarModel } from "./warModel"
import { WorkModel } from "./workModel"
import { CalendarModel } from "./calendarModel"
import { HungerModel } from "./hungerModel"
import { HuntingModel } from "./huntingModel"
import { Log } from "./log"
import { tickInProgressActions } from "./actionsModel"
import { ManualCollectionModel } from "./manualCollectionModel"

export class GameModel implements GameModelInterface {
  civName: string = "The Tribe"
  log = new Log()
  calendar = new CalendarModel(this)
  resources = new ResourcesModel()
  population = new PopulationModel()
  work = new WorkModel(this)
  manualCollection = new ManualCollectionModel()
  military = new MilitaryModel(this.population)
  civilizations = new CivilizationsModel()
  wars = new WarModel(this)
  hunger = new HungerModel(this.population, this.resources, this.log)
  hunting = new HuntingModel(this.population, this.resources, this.log)

  filterUnsatisfiableCosts(costs: Amount[]): Amount[] {
    return this.resources.filterUnsatisfiableCosts(costs)
      .concat(this.population.filterUnsatisfiableCosts(costs))
  }

  onConsume(costs: Amount[]) {
    this.resources.pay(costs)
    this.population.onConsume(costs)
  }

  onProduce(value: Amount[]) {
    this.work.add(value)
    this.resources.add(value)
    this.population.onProduce(value)
  }

  canPay(elem: Amount) {
    return this.resources.filterUnsatisfiableCosts([elem]).length === 0
      && this.population.filterUnsatisfiableCosts([elem]).length === 0
  }

  onTick(deltaS: number) {
    onTick(deltaS)
    this.calendar.onTick(deltaS)
    this.applyWorkConsumptionAndProduction(deltaS)
    tickInProgressActions(this, deltaS)
  }

  onEndOfSeason() {
    this.hunger.feedPops()
  }

  onEndOfTurn() {
    this.hunting.multiplyAnimals()
  }

  production(resourceType: ResourceType): number {
    return this.population.production(resourceType)
  }

  consumption(resourceType: ResourceType): number {
    return this.population.consumption(resourceType)
  }

  applyWorkConsumptionAndProduction(deltaS: number) {
    this.population.pops.forEach(pop => {
      pop.consumption.forEach(res => {
        this.resources.resource(res.type).sub(res.count * deltaS)
      })
      pop.production.forEach(res => {
        this.resources.resource(res.type).add(res.count * deltaS)
      })
     pop.work.forEach(w => {
        this.work.work(w.type).add(w.count * deltaS)
      })
    })
  }
}
