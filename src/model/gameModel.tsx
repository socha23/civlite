import { ActionCostChecker, CostElem } from "./action"
import { GatherResourceAction, ResourcesModel } from "./resources"
import { PopulationModel } from "./popModel"
import { onTick } from "./timer"

export class GameModel implements ActionCostChecker {
  tick: number = 0
  resources = new ResourcesModel()
  population = new PopulationModel()

  gatherFoodAction = new GatherResourceAction(this.resources.food, {timeout: 1, costs: []})

  filterUnsatisfiableCosts(costs: CostElem[]): CostElem[] {
    return this.resources.filterUnsatisfiableCosts(costs)
  }

  payCosts(costs: CostElem[]) {
    this.resources.payCosts(costs)
  }

  onTick(deltaS: number) {
    this.tick += deltaS
    onTick(deltaS)
    this.applyFood(deltaS)
 }

 applyFood(deltaS: number) {
  this.resources.food.count += 
    (this.population.foodProduction - this.population.foodConsumption) * deltaS
 }
}
