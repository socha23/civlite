import React from 'react';
import { ResourceType } from '../model/resources';
import { PopType } from '../model/pops';

export const DividerColors = {
    mid: "#888",
    light: "#ccc"
}

export const Colors = {
    default: "#222",
    grayedOut: "#bbb",
    captions: "#000"
}


export const FontSizes = {
    small: 10,
    normal: 16,
    big: 20,
    xbig: 26
}

export const Icons = {
    [PopType.Idler]: 'fa-solid fa-person',
    [PopType.Gatherer]: 'fa-solid fa-person-hiking',
    [PopType.Laborer]: 'fa-solid fa-person-digging',
    [PopType.Farmer]: 'fa-solid fa-person-arrow-up-from-line',
    // herder: 'fa-solid fa-person-walking-with-cane',
    [ResourceType.Food]: 'fa-solid fa-wheat-awn',
    [ResourceType.Labor]: 'fa-solid fa-hand',
    
    population: "fa-solid fa-people-group",
}

export const Labels = {
    TotalPopulation: "Total population",
    PerPop: "/ pop",
    PerSecond: "/ s",
    Recruitment: "Recruitment",
    Assign: {
        [PopType.Idler]: 'Spawn Idler',
        [PopType.Gatherer]: 'Assign Gatherer',
        [PopType.Laborer]: 'Assign Laborer',
        [PopType.Farmer]: 'Build Farm',
    },
    Plural: {
        [PopType.Idler]: 'Idlers',
        [PopType.Gatherer]: 'Gatherers',
        [PopType.Laborer]: 'Laborers',
        [PopType.Farmer]: 'Farmers',
    },
}

export const GatherActionLabels = {
    [ResourceType.Food]: 'Gather Food',
    [ResourceType.Labor]: 'Perform Labor'
}

export const ResourceLabels = {
    [ResourceType.Food]: 'Food',
    [ResourceType.Labor]: 'Labor',
}

export const TrendColors = {
    positive: "#0a0",
    negative: "#a00",
}