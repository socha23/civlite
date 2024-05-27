import {GameViewProps, gameViewProps} from '../view/gameView'
import {GameModel} from './gameModel'

export class GameController {

  model: GameModel = new GameModel()

  onReset() {
      this.model = new GameModel()
  }

  onTick(deltaS: number) {
    this.model.onTick(deltaS)
  }

  get viewProps(): GameViewProps {
    return gameViewProps(this.model, () => this.onReset())
  }
}

