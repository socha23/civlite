import { CalendarMessages } from "../view/calendarLabels"
import { Season } from "./calendarConsts"
import { GameModel } from "./gameModel"

const SEASONS = [Season.Spring, Season.Summer, Season.Autumn, Season.Winter]

export const SEASON_DURATION = 30
export const TURN_DURATION = 1

export class CalendarModel {
  timeUntilEndOfSeason: number = SEASON_DURATION
  timeUntilEndOfTurn: number = TURN_DURATION
  currentSeason: Season = Season.Spring
  model: GameModel

  constructor(model: GameModel) {
    this.model = model
  }

  progressSeason(deltaS: number) {
    let timeLeft = deltaS
    while (timeLeft > 0) {
      const timeLeftThisSeason = Math.min(timeLeft, this.timeUntilEndOfSeason)
      timeLeft -= timeLeftThisSeason
      this.timeUntilEndOfSeason -= timeLeftThisSeason
      if (this.timeUntilEndOfSeason <= 0) {
        this.onEndOfSeason()
      }
    }
  }

  progressTurn(deltaS: number) {
    let timeLeft = deltaS
    while (timeLeft > 0) {
      const timeLeftThisTurn = Math.min(timeLeft, this.timeUntilEndOfTurn)
      timeLeft -= timeLeftThisTurn
      this.timeUntilEndOfTurn -= timeLeftThisTurn
      if (this.timeUntilEndOfTurn <= 0) {
        this.onEndOfTurn()
      }
    }
  }

  onTick(deltaS: number) {
    this.progressSeason(deltaS)
    this.progressTurn(deltaS)
  }

  onEndOfTurn() {
    this.model.onEndOfTurn()
    this.timeUntilEndOfTurn = TURN_DURATION
  }

  onEndOfSeason() {
    this.model.onEndOfSeason()
    const newIdx = (SEASONS.indexOf(this.currentSeason) + 1) % SEASONS.length
    const newSeason = SEASONS[newIdx]
    this.model.log.info(<CalendarMessages.SeasonEnds oldSeason={this.currentSeason} newSeason={newSeason}/>)
    this.currentSeason = newSeason
    this.timeUntilEndOfSeason = SEASON_DURATION
  }

}
