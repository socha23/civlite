import { ResourceType } from '../model/resources';
import { PopType } from '../model/pops';
import { WarType } from '../model/wars';
import { formatNumber } from '../model/utils';
import { ReactNode } from 'react';
import { WarProps } from './war';
import { WorkType } from '../model/work';

export const DividerColors = {
    mid: "#888",
    light: "#ccc"
}

export const Colors = {
    active: "#D0D6B5",
    award: "#0A0",
    cost: "#A00",
    default: "#222",
    grayedOut: "#bbb",
    captions: "#000",
    selected: "#f88",
    OurArmy: "#080",
    EnemyArmy: "#800",
    ActiveWar: "#800",
    UnsatisfiableCost: "#800",
    PausedIndicator: "#f00",
    Warning: "#800",
    Positive: "#0a0",

    Research: "#cee0ed",
    Pack: "#FFB22C",
}


export const FontSizes = {
    small: 10,
    normal: 12,
    normalPlus: 16,
    big: 20,
    xbig: 26
}

export const Icons = {
    PanelExpand: 'fa-solid fa-chevron-down',
    PanelHide: 'fa-solid fa-chevron-up',

    Plus: 'fa-solid fa-plus',
    Minus: 'fa-solid fa-minus',

    [PopType.Idler]: 'fa-solid fa-person',
    [PopType.Hunter]: 'fa-solid fa-person-hiking',
    [PopType.Laborer]: 'fa-solid fa-person-digging',
    [PopType.Farmer]: 'fa-solid fa-person-arrow-up-from-line',
    [PopType.Herder]: 'fa-solid fa-person-walking-with-cane',
    [PopType.Brave]: 'fa-solid fa-person-walking',
    [PopType.Slinger]: 'fa-solid fa-person-walking-arrow-right',

    [ResourceType.Herds]: 'fa-solid fa-horse',
    [ResourceType.Food]: 'fa-solid fa-wheat-awn',
    [ResourceType.WildAnimalsSmall]: 'fa-solid fa-otter',
    [ResourceType.WildAnimalsBig]: 'fa-solid fa-hippo',

    [WorkType.Labor]: 'fa-solid fa-hand',
    [WorkType.Insight]: 'fa-regular fa-lightbulb',
    [WorkType.Hunting]: 'fa-solid fa-bullseye',
    [WorkType.Gathering]: 'fa-solid fa-carrot',

    [ResourceType.Forest]: 'fa-solid fa-tree',
    [ResourceType.Grassland]: 'fa-solid fa-seedling',
    
    population: "fa-solid fa-people-group",
    strength: "fa-solid fa-hand-fist",
    target: "fa-solid fa-crosshairs",

    default: "fa-solid fa-person",
}

export const Labels = {
    StartWar: "Go fight",
    CompleteWar: "OK",

    WarParty: "War party",
    Execute: "Execute",
    TotalPopulation: "Total population",
    [ResourceType.Food]: 'Food',
    [ResourceType.Herds]: 'Herds',
    [WorkType.Labor]: 'Labor',
    [WorkType.Insight]: 'Insight',
    [ResourceType.Forest]: 'Forest',
    Forests: "Forests",
    [ResourceType.Grassland]: 'Grassland',
    [WarType.BeatemUp]: "Beat'em up",
    [WarType.CattleRaid]: "Cattle raid",
    [WarType.SlaveRaid]: "Slave raid",
    [WarType.Subjugation]: "Subjugation",    
}

export const ArmyLabels = {
    ArmyAssignmentIdle: ({}) => <span>Idle</span>,
    ArmyAssignmentWar: (p: {goal: WarType, against: ReactNode}) => <span>{Labels[p.goal]} against {p.against}</span>,
}




export const BattleLabels = {
    EnemyLabel: "Enemy",

    CivBoxTitle: (p: {goal: WarType, army: string}) => <span>{Labels[p.goal]} by {p.army}</span>,
    ArmyReturned: (p: {army: string}) => <span>{p.army} returned.</span>,
    ArmyInBattle: (p: {army: string}) => <span>{p.army} is in combat.</span>,
    ArmyVictorius: (p: {army: string}) => <span>{p.army} is victorious!</span>,
    ArmyRetreating: (p: {army: string}) => <span>{p.army} is retreating</span>,
    ArmyLost: (p: {army: string}) => <span>{p.army} lost!</span>,
    ArmyMarchingBackHome: (p: {army: string}) => <span>{p.army} is marching back</span>,
    MarchTime: (p: {time: number}) => <span>March time: {formatNumber(p.time)} seconds</span>,
    
    March: "March",
    Cancel: "Cancel",
    Complete: "OK",
    Fight: "Fight",
    Retreat: "Retreat",
    MarchBackHome: "Return home",

    ExpectedOpposition: "Opposition:",
    ExpectedReward: "Loot:",
    Reward: "Loot:",
}

export const BattleAgainstDescription = (p: WarProps) => <span style={{
    color: p.againstColor
}}>{p.againstTitle}</span>

export const BattleLongDescription = (p: WarProps) => <div>
    {
        (p.goal === WarType.BeatemUp) && <div>
            Go and roughen up those <BattleAgainstDescription {...p}/> a little. 
            We won't take any of their stuff, just teach them a lesson.
        </div>
    }
    {
        (p.goal === WarType.CattleRaid) && <div>
            Cattle breeds slow. What if we went to <BattleAgainstDescription {...p}/> pastures 
            and took some of theirs?
        </div>
    }
    {
        (p.goal === WarType.SlaveRaid) && <div>
            Work is hard and those asshole <BattleAgainstDescription {...p}/> are 
            soft. Let's take some of their people and make them our slaves.
        </div>
    }
    {
        (p.goal === WarType.Subjugation) && <div>
            We're stronger than <BattleAgainstDescription {...p}/>, 
            so it's only natural they should serve us.
        </div>
    }
</div>

export const MainLabels = {
    Paused: "Paused"
}


export const TrendColors = {
    positive: "#0a0",
    negative: "#a00",
}