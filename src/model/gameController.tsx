import {GameViewProps, gameViewProps} from '../view/gameView'
import {GameModel} from './gameModel'

const MINIMUM_TIME_RESOLUTION_MS = 100

export class GameController {

  model: GameModel = new GameModel()
  lastUpdate = Date.now()

  onReset() {
      this.model = new GameModel()
  }

  update() {
      const currentTime = Date.now()
      let millisLeft = currentTime - this.lastUpdate
      while (millisLeft > MINIMUM_TIME_RESOLUTION_MS) {
        this.onTick(MINIMUM_TIME_RESOLUTION_MS / 1000)
        millisLeft -= MINIMUM_TIME_RESOLUTION_MS
      }
      this.onTick(millisLeft / 1000)
      this.lastUpdate = currentTime
  }

  onTick(deltaS: number) {
    this.model.onTick(deltaS)
  }

  get viewProps(): GameViewProps {
    return gameViewProps(this.model, () => this.onReset())
  }
}

