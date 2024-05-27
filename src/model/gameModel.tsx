import {GameState, initGameState} from '../state/gameState'
import {GameViewProps} from '../view/gameView'
import {TestModel} from './testModel'

export class GameModel {

  state: GameState = initGameState()
  test: TestModel = new TestModel(this.state.test)

  onReset() {
      this.state = initGameState()
      this.test = new TestModel(this.state.test)
  }



  updateState(deltaS: number) {
    this.state.tick += deltaS
    this.test.updateState(deltaS)
  }

  get viewProps(): GameViewProps {
    return {
      tick: this.state.tick,
      test: this.test.viewProps,
      reset: {
        title: "Reset",
        action: () => this.onReset()
      }
    }
  }
}
