import { CalendarMessages } from "../view/calendarLabels"
import { Season } from "./calendarConsts"
import { GameModel } from "./gameModel"

const SEASONS = [Season.Spring, Season.Summer, Season.Autumn, Season.Winter]

export const SEASON_DURATION = 15

export class CalendarModel {
  timeUntilEndOfSeason: number = SEASON_DURATION
  currentSeason: Season = Season.Spring
  model: GameModel

  constructor(model: GameModel) {
    this.model = model
  }

  onTick(deltaS: number) {
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

  onEndOfSeason() {
    this.model.onEndOfSeason()
    const newIdx = (SEASONS.indexOf(this.currentSeason) + 1) % SEASONS.length
    const newSeason = SEASONS[newIdx]
    this.model.log.info(<CalendarMessages.SeasonEnds oldSeason={this.currentSeason} newSeason={newSeason}/>)
    this.currentSeason = newSeason
    this.timeUntilEndOfSeason = SEASON_DURATION
  }

}
