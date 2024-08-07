import {GameViewProps, gameViewProps} from '../view/gameView'
import {GameModel} from './gameModel'
import { onTick } from './timer'

const MINIMUM_TIME_RESOLUTION_MS = 100

export class GameController {

  model: GameModel = new GameModel()
  lastUpdate = Date.now()

  constructor() {
    this.setInitialState()
  }

  onReset() {
      this.model = new GameModel()
      this.setInitialState()
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
    //const logicStartTime = window.performance.now()
    onTick(deltaS)
    this.model.onTick(deltaS)
    //console.log("Tick took " + (window.performance.now() - logicStartTime))
  }

  get viewProps(): GameViewProps {
    return gameViewProps(this.model, () => this.onReset())
  }


  setInitialState() {
  }
}

