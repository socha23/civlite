import { ResourceType,  } from "./resources"
import { Action, action } from "./action"
import { sum } from './utils'
import { popTypeDefinition, PopType } from "./pops"
import { Amount, ItemType, ResourceAmount, WorkAmount, isPopAmount, isPopType, isResourceAmount, multiply, pops, resources, work } from "./amount"
import { Assignable } from "./assignable"
import { WorkType } from "./work"
import { isWorkNeeded } from "./actionsModel"
import { SoundType } from "../view/sounds"
import { spawnEffectAwards } from "../view/effects"
import { coordsIdPopCount } from "../view/coordsCatcher"

export class PopModel {

  type: PopType
  _count: number = 0
  buyAction: Action
  sellAction: Action
  _assignables: Set<Assignable> = new Set()

  constructor(type: PopType) {
    this.type = type

    this.buyAction = action({
      id: `buy_${type}`,
      initialCost: this.definition.buyCost,
      workCost: this.definition.workCost,
      timeCost: this.definition.timeCost,
      expectedRewards: [pops(type, 1)],
      soundOnComplete: SoundType.NewPop
    })
    this.sellAction = action({      
      id: `sell_${type}`,
      expectedRewards: [],
      action: () => {this.decCount(1)},
      disabled: () => this.decCountDisabled(1)
    })

    this._count = 0
  }

  get count() {
    return this._count
  }

  get definition() {
    return popTypeDefinition(this.type)
  }

  get singlePopProduction(): ResourceAmount[] {
    return this.definition.production
  }

  singlePopProductionOfType(t: ItemType): number {
    return this.singlePopProduction.find(w => w.type === t)?.count || 0
  }

  get totalPopProduction(): ResourceAmount[] {
    return multiply(this.singlePopProduction, this.count).filter(a => a.count !== 0)

  }

  get singlePopFoodConsumption(): number {
    return this.definition.foodConsumption
  }

  get actualWork(): WorkAmount[] {
    return multiply(
        this.singlePopWork.filter(t => isWorkNeeded(t.type)),
      this.count
    ).filter(a => a.count !== 0)
  }

  get singlePopWork(): WorkAmount[] {
    return this.definition.work
  }

  get totalPopWork(): WorkAmount[] {
    return multiply(this.singlePopWork, this.count)
  }
  
  singlePopWorkOfType(t: WorkType): number {
    return this.definition.work.find(w => w.type === t)?.count || 0
  }

  get unassignedCount() {
    let all = this.count
    this._assignables.forEach(a => {
      all -= a.assignedCount(this.type)
    })
    return all
  }

  assignedCount(to: Assignable): number {
    return to.assignedCount(this.type)
  }

  assign(to: Assignable) {
    this._assignables.add(to)
    if (this.unassignedCount === 0) {
      throw new Error(`No unassigned pops of type ${this.type}`)
    }
    to.assign(this.type)
  }

  assignDisabled() {
    if (this.unassignedCount === 0) {
      return `No unassigned ${this.type}`
    } 
  }

  unassign(to: Assignable) {
    to.unassign(this.type, 1)
  }

  unassignDisabled(to: Assignable) {
    return to.unassignDisabled(this.type)
  }

  add(howMuch: number) {
    this._count += howMuch
  }

  decCountDisabled(howMuch: number) {
    let decreasable = this.count
    this._assignables.forEach((a => {
      if (a.locked) {
        decreasable -= a.assignedCount(this.type)
      }
    }))
    if (decreasable < howMuch) {
      return `${this.type} too low`
    }
  }

  decCount(howMuch: number) {
    let leftToUnassign = howMuch
    leftToUnassign = Math.max(0, leftToUnassign - this.unassignedCount)
    if (leftToUnassign > 0) {
      this._assignables.forEach(a => {
        if (!a.locked) {
          const numberToUnassign = Math.min(a.assignedCount(this.type), leftToUnassign)
          a.unassign(this.type, numberToUnassign)
          leftToUnassign -= numberToUnassign
        }
      })
    }
    this._count -= howMuch
  }
}



function createPopModel(type: PopType): PopModel {
  return new PopModel(type)
}

export class PopulationModel {

  pops = Object.values(PopType).map(type => createPopModel(type))

  pop(type: PopType): PopModel {
    return this.pops.find(m => m.type === type)!
  }

  filterUnsatisfiableCosts(costs: Amount[]): Amount[] {
    return costs.filter(c => (isPopType(c.type)) &&
        c.count > this.pop(c.type).count
    )
  }

  onConsume(costs: Amount[]) {
    costs.forEach(c => {
        if (isPopAmount(c)) {
            this.pop(c.type).decCount(c.count)
        }
    })
  }

  onProduce(costs: Amount[]) {
    costs.forEach(c => {
        if (isPopAmount(c)) {
            this.pop(c.type).add(c.count)
        }
    })
  }

  production(resourceType: ResourceType): number {
    return sum(this.pops, pop => pop.singlePopProductionOfType(resourceType) * pop.count)
  }

  get total() {
    return sum(this.pops, pop => pop.count)
  }

  get idlers() {
    return this.pop(PopType.Idler)
  }

}
