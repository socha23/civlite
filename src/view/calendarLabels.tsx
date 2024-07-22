import React from 'react';
import { Season } from '../model/calendarConsts';

export const CalendarLabels = {
    UntilEndOfSeason: "End of season in",
    Second: "s",
    [Season.Spring]: "Spring", 
    [Season.Summer]: "Summer", 
    [Season.Autumn]: "Autumn", 
    [Season.Winter]: "Winter", 
}

export const CalendarMessages = {
    SeasonEnds: (p: {oldSeason: Season, newSeason: Season}) => <span>
            {CalendarLabels[p.oldSeason]} ends. {CalendarLabels[p.newSeason]} begins.
        </span>,
}

