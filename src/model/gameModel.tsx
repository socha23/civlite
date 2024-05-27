import {TestModel} from './testModel'

export class GameModel {
  tick: number = 0
  test: TestModel =  new TestModel()

  onTick(deltaS: number) {
    this.test.onTick(deltaS)    
    this.tick += deltaS
 }
}
