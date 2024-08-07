import { Action, GameModelInterface } from "./action"
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
import { GatheringModel } from "./gatheringModel"
import { UpgradeModel } from "./upgradeModel"
import { resetProgress } from "./progress"
import { CheatsModel } from "./cheatsModel"
import { STARTING_UPGRADES } from "./upgrade"
import { AudioModel } from "./audioModel"
import { spawnEffectAwards } from "../view/effects"

export class GameModel implements GameModelInterface {

  paused = false

  civName: string = "The Tribe"
  log = new Log()
  audio = new AudioModel(this)
  calendar = new CalendarModel(this)
  resources = new ResourcesModel()
  population = new PopulationModel()
  work = new WorkModel(this)
  manualCollection = new ManualCollectionModel()
  military = new MilitaryModel(this.population)
  civilizations = new CivilizationsModel()
  wars = new WarModel(this)
  hunger = new HungerModel(this.population, this.resources, this.log, this.audio)
  hunting = new HuntingModel(this.population, this.resources, this.log)
  gathering = new GatheringModel(this.population, this.resources, this.calendar, this.log)
  upgrades = new UpgradeModel(this)

  progress = resetProgress()

  cheats = new CheatsModel(this)
  gameLost = false

  constructor() {
    STARTING_UPGRADES.forEach(r => {this.upgrades.addAvailableUpgrade(r)})
  }

  filterUnsatisfiableCosts(costs: Amount[]): Amount[] {
    return this.resources.filterUnsatisfiableCosts(costs)
      .concat(this.population.filterUnsatisfiableCosts(costs))
  }

  onConsume(costs: Amount[]) {
    this.resources.pay(costs)
    this.population.onConsume(costs)
  }

  onActionComplete(action: Action) {
    this.audio.onActionComplete(action)
    if (action.actualRewards) {
      spawnEffectAwards(action.id, action.actualRewards)
      this.onProduce(action.actualRewards)

    }
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
    if (this.paused || this.gameLost) {
      return
    }
    this.calendar.onTick(deltaS)
    this.applyWorkAndProduction(deltaS)
    this.wars.onTick(deltaS)
    tickInProgressActions(this, deltaS)
    this.upgrades.onTick(deltaS)

    this.checkGameLostCondition()

    this.audio.onTick(deltaS)
  }

  checkGameLostCondition() {
    if (this.progress.GameLostEnabled && this.population.total === 0) {
      this.gameLost = true
    }
  }

  onEndOfSeason() {
    this.audio.onEndOfSeason()
  }

  onEndOfTurn() {
    this.audio.onEndOfTurn()
    this.hunger.onEndOfTurn()
    this.hunting.multiplyAnimals()
  }

  production(resourceType: ResourceType): number {
    return this.population.production(resourceType)
  }

  applyWorkAndProduction(deltaS: number) {
    this.population.pops.forEach(pop => {
      pop.totalPopProduction.forEach(res => {
        this.resources.resource(res.type).add(res.count * deltaS)
      })
     pop.actualWork.forEach(w => {
        this.work.work(w.type).add(w.count * deltaS)
      })
    })
  }
}
