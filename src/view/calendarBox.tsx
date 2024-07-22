import React from 'react';
import { Box } from './box'
import { GameModel } from '../model/gameModel'
import { Season } from '../model/calendarConsts';
import { FontSizes } from './icons';
import { CalendarLabels } from './calendarLabels';

export type CalendarProps = {
  season: Season
  timeUntilEndOfSeason: number
}

export function calendarProps(model: GameModel): CalendarProps {
  return {
    season: model.calendar.currentSeason,
    timeUntilEndOfSeason: model.calendar.timeUntilEndOfSeason
  }
}

function seasonIcon(s: Season): string {
  switch (s) {
    case Season.Spring: return "fa-solid fa-cloud-rain"
    case Season.Summer: return "fa-solid fa-sun"
    case Season.Autumn: return "fa-solid fa-cloud-showers-heavy"
    case Season.Winter: return "fa-solid fa-snowflake"
  }
}

export const CalendarBox = (p: CalendarProps) =>
  <Box>
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 4,
      marginTop: 4,
      marginBottom: 4,
      fontSize: FontSizes.normalPlus,
    }}>
      <div style={{
        width: 20,
        textAlign: "center"
      }}>
        <i className={seasonIcon(p.season)} />
      </div>
      <div style={{
        width: 110
      }}>
        {CalendarLabels[p.season]}
      </div>


      <div style={{
        marginLeft: 8,
        height: 18,
        display: "flex",
        alignItems: "end",
        fontSize: FontSizes.small,
      }}>
        <span>
          {CalendarLabels.UntilEndOfSeason}
        </span>
        <span style={{
          marginLeft: 4,
          fontSize: FontSizes.small
        }}>
          {Math.ceil(p.timeUntilEndOfSeason)}{CalendarLabels.Second}
        </span>
      </div>
    </div>
  </Box>