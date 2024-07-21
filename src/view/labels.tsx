import { ResourceType } from '../model/resources';
import { PopType } from '../model/pops';
import { WarType } from '../model/wars';
import { formatNumber } from '../model/utils';
import { ReactNode } from 'react';
import { WarProps } from './war';
import { WorkType } from '../model/work';


export const ManualResourceGatheringLabels = {
    [ResourceType.Food]: {
        ActionTitle: "Gather food",
        ButtonTitle: "Start",
        Description: "Collect some mushrooms and herbs. " + 
            "This will produce a small amount of food."
    },
    [ResourceType.Insight]: {
        ActionTitle: "Sit and think",
        ButtonTitle: "Start",
        Description: "Relax, look into the sky and ponder the world surrounding you. " + 
            "This will produce a small amount of insight."
    },
    [ResourceType.Labor]: {
        ActionTitle: "Manual labor",
        ButtonTitle: "Start",
        Description: "Roll up your sleeves and get to work. " + 
            "This will produce a small amount of labor."
    },
}

export const ActionCommonLabels = {
    Cost: "Cost:",
    Rewards: "Rewards:",
    Time: "Time:",

    Second: "s",
}

