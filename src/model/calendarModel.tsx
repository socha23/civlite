import { GameModel } from "./gameModel"


export enum Season {
  Spring = 0,
  Summer = 1,
  Autumn = 2,
  Winter = 3,
}

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
    this.currentSeason = SEASONS[newIdx]
    this.timeUntilEndOfSeason = SEASON_DURATION
  }

}
