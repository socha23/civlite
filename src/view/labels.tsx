import { ResourceType } from '../model/resources';
import { PopType } from '../model/pops';
import { WarType } from '../model/wars';
import { formatNumber } from '../model/utils';
import { ReactNode } from 'react';
import { WarProps } from './war';
import { WorkType } from '../model/work';
import { Season } from '../model/calendarModel';


export const ManualResourceGatheringLabels = {
    [ResourceType.Food]: {
        ActionTitle: "Gather food",
        ButtonTitle: "Start",
        Description: "Collect some mushrooms and herbs. " + 
            "This will produce a small amount of food."
    },
    [WorkType.Insight]: {
        ActionTitle: "Sit and think",
        ButtonTitle: "Start",
        Description: "Relax, look into the sky and ponder the world surrounding you. " + 
            "This will produce a small amount of insight."
    },
    [WorkType.Labor]: {
        ActionTitle: "Manual labor",
        ButtonTitle: "Start",
        Description: "Roll up your sleeves and get to work. " + 
            "This will produce a small amount of labor."
    },
}

export const PopulationRecruitLabels = {
    [PopType.Idler]: {
        ActionTitle: "Make babies",
        ButtonTitle: "Spawn",
        Description: "Expand population of the tribe. Newly born tribesmen will " + 
            "be born as Idlers but can be assigned to other tasks."
    },   
    [PopType.Gatherer]: {
        ActionTitle: "Hunt and Gather",
        ButtonTitle: "Assign Idler",
        Description: "Order an Idler to gather food by hunting and gathering. Requires an " + 
            "unassigned forest."
    },   
    [PopType.Laborer]: {
        ActionTitle: "Expand unskilled labor",
        ButtonTitle: "Assign Idler",
        Description: "Send an Idler to do backbreaking unskilled work."
    },   
    [PopType.Herder]: {
        ActionTitle: "Build a pasture",
        ButtonTitle: "Assign Idler",
        Description: "Build a pasture on unassigned grassland. Will upgrade one Idler to Herder."
    },   
    [PopType.Farmer]: {
        ActionTitle: "Build a farm",
        ButtonTitle: "Assign Idler",
        Description: "Build a farm on unassigned grassland. Will upgrade one Idler to Farmer."
    },   
    [PopType.Brave]: {
        ActionTitle: "Train a Brave",
        ButtonTitle: "Assign",
        Description: "Trains one Idler to be a Brave. Braves are somewhat good at close combat."
    },   
    [PopType.Slinger]: {
        ActionTitle: "Train a Slinger",
        ButtonTitle: "Assign",
        Description: "Trains one Idler to be a Slinger. Slingers are good at ranged combat."
    },   
}

export const PopulationUnrecruitLabels = {
    [PopType.Idler]: {
        ActionTitle: "Intertribal violence",
        ButtonTitle: "Kill",
        Description: "Sometimes discussion gets hot, or food gets scarce. Remove one Idler."
    },   
    [PopType.Gatherer]: {
        ActionTitle: "Unassign",
        ButtonTitle: "Unassign",
        Description: "Unassign Gatherer from working in the forest."
    },   
    [PopType.Laborer]: {
        ActionTitle: "Unassign",
        ButtonTitle: "Unassign",
        Description: "Unassign Laborer from doing manual work."
    },   
    [PopType.Herder]: {
        ActionTitle: "Destroy a pasture",
        ButtonTitle: "Unassign",
        Description: "Destroy a pasture and reclaim grassland. One Herder will be demoted back to Idler."
    },   
    [PopType.Farmer]: {
        ActionTitle: "Destroy a farm",
        ButtonTitle: "Unassign",
        Description: "Destroy a farm and reclaim grassland. One Farmer will be demoted back to Idler."
    },   
    [PopType.Brave]: {
        ActionTitle: "Demobilize",
        ButtonTitle: "Unassign",
        Description: "Send a Brave back to workers pool."
    },   
    [PopType.Slinger]: {
        ActionTitle: "Demobilize",
        ButtonTitle: "Unassign",
        Description: "Send a Slinger back to workers pool."
    },   
}

export const ActionCommonLabels = {
    Cost: "Cost:",
    Rewards: "Rewards:",
    Time: "Time:",

    Second: "s",
}

export const CalendarLabels = {
    UntilEndOfSeason: "End of season in",
    Second: "s",
    [Season.Spring]: "Spring", 
    [Season.Summer]: "Summer", 
    [Season.Autumn]: "Autumn", 
    [Season.Winter]: "Winter", 
}