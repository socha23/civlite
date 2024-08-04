import { ResourceType } from '../model/resources';
import { PopType } from '../model/pops';
import { WorkType } from '../model/work';
import { HuntType } from '../model/huntingModel';
import { HungerModel, TURNS_PER_FEEDING } from '../model/hungerModel';
import { UpgradeType } from '../model/upgrade';

export function popLabelSingular(t: PopType): string {
    if (t === PopType.Idler) {
        return "Gatherer"
    } else {
        return t
    }
}

export function popLabelPlural(t: PopType): string {
    switch (t) {
        case PopType.Idler: return "Gatherers"
        case PopType.Hunter: return "Hunters"
        case PopType.Laborer: return "Laborers"
        case PopType.Herder: return "Herders"
        case PopType.Farmer: return "Farmers"
        case PopType.Brave: return "Braves"
        case PopType.Slinger: return "Slingers"
    }
}



export const ManualResourceGatheringLabels = {
    [ResourceType.Food]: {
        ActionTitle: "Gather food",
        ButtonTitle: "Start",
        Description: "Find some mushrooms and herbs"
    },
    [WorkType.Insight]: {
        ActionTitle: "Think",
        ButtonTitle: "Start",
        Description: "Ponder the world around me",
    },
    [WorkType.Labor]: {
        ActionTitle: "Manual labor",
        ButtonTitle: "Start",
        Description: "Roll up my sleeves and get to work"
    },
    NoInsightNeeded: "No Research selected",
}

export const PopulationRecruitLabels = {
    [PopType.Idler]: {
        ActionTitle: "Make babies",
        ButtonTitle: "Spawn",
        Description: `Expand population of the tribe. Newly born tribesmen will ` +
            `be born as ${popLabelPlural(PopType.Idler)} but can be assigned to other tasks.`
    },
    [PopType.Hunter]: {
        ActionTitle: "Go Hunt",
        ButtonTitle: `Assign`,
        Description: `Order ${popLabelSingular(PopType.Idler)} to gather food by hunting and gathering.`
    },
    [PopType.Laborer]: {
        ActionTitle: "Expand unskilled labor",
        ButtonTitle: `Assign`,
        Description: `Send ${popLabelSingular(PopType.Idler)} to do backbreaking unskilled work.`
    },
    [PopType.Herder]: {
        ActionTitle: "Build a pasture",
        ButtonTitle: `Assign`,
        Description: `Build a pasture on unassigned grassland. Will upgrade one ${popLabelSingular(PopType.Idler)} to ${popLabelSingular(PopType.Herder)}.`
    },
    [PopType.Farmer]: {
        ActionTitle: "Build a farm",
        ButtonTitle: `Assign`,
        Description: `Build a farm on unassigned grassland. Will upgrade one ${popLabelSingular(PopType.Idler)} to ${popLabelSingular(PopType.Farmer)}.`
    },
    [PopType.Brave]: {
        ActionTitle: `Train a ${popLabelSingular(PopType.Brave)}`,
        ButtonTitle: "Assign",
        Description: `Trains one ${popLabelSingular(PopType.Idler)} to be a ${popLabelSingular(PopType.Brave)}. ${popLabelPlural(PopType.Brave)} are somewhat good at close combat.`
    },
    [PopType.Slinger]: {
        ActionTitle: `Train a ${popLabelSingular(PopType.Slinger)}`,
        ButtonTitle: "Assign",
        Description: `Trains one ${popLabelSingular(PopType.Idler)} to be a ${popLabelSingular(PopType.Slinger)}. ${popLabelPlural(PopType.Slinger)} are good at ranged combat.`
    },
}

export const PopulationUnrecruitLabels = {
    [PopType.Idler]: {
        ActionTitle: "Intertribal violence",
        ButtonTitle: "Kill",
        Description: `Sometimes discussion gets hot, or food gets scarce. Remove one ${popLabelSingular(PopType.Idler)}.`
    },
    [PopType.Hunter]: {
        ActionTitle: "Unassign",
        ButtonTitle: "Unassign",
        Description: `Unassign ${popLabelSingular(PopType.Hunter)}.`
    },
    [PopType.Laborer]: {
        ActionTitle: "Unassign",
        ButtonTitle: "Unassign",
        Description: `Unassign ${popLabelSingular(PopType.Laborer)} from doing manual work.`
    },
    [PopType.Herder]: {
        ActionTitle: "Destroy a pasture",
        ButtonTitle: "Unassign",
        Description: `Destroy a pasture and reclaim grassland. One ${popLabelSingular(PopType.Herder)} will be demoted back to ${popLabelSingular(PopType.Idler)}.`
    },
    [PopType.Farmer]: {
        ActionTitle: "Destroy a farm",
        ButtonTitle: "Unassign",
        Description: `Destroy a farm and reclaim grassland. One ${popLabelSingular(PopType.Farmer)} will be demoted back to ${popLabelSingular(PopType.Idler)}.`
    },
    [PopType.Brave]: {
        ActionTitle: "Demobilize",
        ButtonTitle: "Unassign",
        Description: `Send a ${popLabelSingular(PopType.Brave)} back to workers pool.`
    },
    [PopType.Slinger]: {
        ActionTitle: "Demobilize",
        ButtonTitle: "Unassign",
        Description: `Send a ${popLabelSingular(PopType.Slinger)} back to workers pool.`
    },
}

export const PopBoxLabels = {
    FoodConsumptionPostfix: "/ " + TURNS_PER_FEEDING + "s",
    PerPop: "Per pop:",
    PerSecond: "/ s",
}

export const ActionCommonLabels = {
    Work: "",
    Cost: "Cost:",
    Rewards: "Rewards:",
    Time: "Time:",

    Second: "s",
}

export const HuntingLabels = {
    [ResourceType.WildAnimalsSmall]: "Small animals",
    [ResourceType.WildAnimalsBig]: "Large animals",
    [HuntType.Small]: {
        title: "Hunt small animals",
        buttonLabel: "Hunt",
        //description: "Hunt small game for food."
    },
    [HuntType.Large]: {
        title: "Hunt large animals",
        buttonLabel: "Hunt",
        //description: "Hunt big game for food."
    },
}

export const GatheringLabels = {
    GatherAction: {
        title: "Gather fruit and herbs",
        buttonLabel: "Gather",
    },
    GathereringBase: "Gathering base:",
    ForestCap: "Forest cap:",
    SeasonalMultiplier: "Season modifier:",
    TotalFood: "Total:",
}

export const FoodLabels = {
    FoodStocks: "Food stocks:",
    FoodConsumptionPerSeason: "Consumption / season:",
    HungerWarning: "Hunger warning!",
    HungerWarningDesc: "Some people will not have enough to eat at the end of the season",
}

export const UpgradeLabels = {
    [UpgradeType.Init]: {
        TitlePrefix: "",
        ButtonTitle: "Research",
    },
    [UpgradeType.Research]: {
        TitlePrefix: "Research: ",
        ButtonTitle: "Research",
    },
    [UpgradeType.Pack]: {
        TitlePrefix: "Buy: ",
        ButtonTitle: "Open pack",
    },
}