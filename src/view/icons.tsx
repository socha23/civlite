import React from 'react';
import { ResourceType } from '../model/resources';
import { PopType } from '../model/pops';

export const DividerColors = {
    mid: "#888",
    light: "#ccc"
}

export const FontSizes = {
    small: 10,
    normal: 16,
    big: 20,
    xbig: 26
}

export const Icons = {
    population: "fa-solid fa-people-group"
}

export const Labels = {
    TotalPopulation: "Total population",
    PerPop: "per pop",
}

export const GatherActionLabels = {
    [ResourceType.Food]: 'Gather Food',
    [ResourceType.Labor]: 'Perform Labor'
}

export const ResourceIcons = {
    [ResourceType.Food]: 'fa-solid fa-wheat-awn',
    [ResourceType.Labor]: 'fa-solid fa-hand',
}

export const ResourceLabels = {
    [ResourceType.Food]: 'Food',
    [ResourceType.Labor]: 'Labor',
}

export const PopLabels = {
    [PopType.Gatherer]: 'Gatherers',
    [PopType.Laborer]: 'Laborers',
    [PopType.Farmer]: 'Farmers',
}

export const TrendColors = {
    positive: "#0a0",
    negative: "#a00",
}

export const BuyPopLabels = {
    [PopType.Gatherer]: 'Add Gatherer',
    [PopType.Laborer]: 'Promote Laborer',
    [PopType.Farmer]: 'Promote Farmer',
}
