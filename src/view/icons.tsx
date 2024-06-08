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
    normal: 12,
    normalPlus: 16,
    big: 20,
    xbig: 26
}

export const Icons = {
    [PopType.Idler]: 'fa-solid fa-person',
    [PopType.Gatherer]: 'fa-solid fa-person-hiking',
    [PopType.Laborer]: 'fa-solid fa-person-digging',
    [PopType.Farmer]: 'fa-solid fa-person-arrow-up-from-line',
    [PopType.Herder]: 'fa-solid fa-person-walking-with-cane',
    [PopType.Brave]: 'fa-solid fa-person-walking',
    [ResourceType.Herds]: 'fa-solid fa-horse',
    [ResourceType.Food]: 'fa-solid fa-wheat-awn',
    [ResourceType.Labor]: 'fa-solid fa-hand',
    [ResourceType.Insight]: 'fa-regular fa-lightbulb',
    [ResourceType.Forest]: 'fa-solid fa-tree',
    [ResourceType.Grassland]: 'fa-solid fa-seedling',
    
    population: "fa-solid fa-people-group",
}

export const Labels = {
    WarParty: "War party",
    Execute: "Execute",
    TotalPopulation: "Total population",
    PerPop: "/ pop",
    PerSecond: "/ s",
    Recruitment: "Recruitment",
    Assign: {
        [PopType.Idler]: 'Spawn Idler',
        [PopType.Gatherer]: 'Add Gatherer',
        [PopType.Laborer]: 'Add Laborer',
        [PopType.Herder]: 'Build Pasture',
        [PopType.Farmer]: 'Build Farm',
        [PopType.Brave]: 'Mobilize a Brave',
    },
    Unassign: {
        [PopType.Idler]: 'Destroy Idler',
        [PopType.Gatherer]: 'Unassign',
        [PopType.Laborer]: 'Unassign',
        [PopType.Herder]: 'Destroy Pasture',
        [PopType.Farmer]: 'Destroy Farm',
        [PopType.Brave]: 'Demobilize',
    },
    Plural: {
        [PopType.Idler]: 'Idlers',
        [PopType.Gatherer]: 'Gatherers',
        [PopType.Laborer]: 'Laborers',
        [PopType.Herder]: 'Herders',
        [PopType.Farmer]: 'Farmers',
        [PopType.Brave]: 'Braves',
    },
    [ResourceType.Food]: 'Food',
    [ResourceType.Herds]: 'Herds',
    [ResourceType.Labor]: 'Labor',
    [ResourceType.Insight]: 'Insight',
    [ResourceType.Forest]: 'Forest',
    [ResourceType.Grassland]: 'Grassland',
}

export const GatherActionLabels = {
    [ResourceType.Herds]: 'Spawn Herd',
    [ResourceType.Food]: 'Gather Food',
    [ResourceType.Insight]: 'Think',
    [ResourceType.Labor]: 'Perform Labor',
    [ResourceType.Forest]: 'Spawn Forest',
    [ResourceType.Grassland]: 'Spawn Grasslands',
}

export const TrendColors = {
    positive: "#0a0",
    negative: "#a00",
}