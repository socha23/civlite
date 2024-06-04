import { Action, ActionParams } from "./action"
import { CostElem, Resources } from './costs'

export enum ResourceType {
    Food = "Food", 
    Labor = "Labor",
}

export const ResourceDefinitions = {
    [ResourceType.Food]: {gatherTimeout: 0.5, initialCap: 30},
    [ResourceType.Labor]: {gatherTimeout: 1, initialCap: 10},
}

export function allResourceTypes(): ResourceType[] {
    return Object.values(ResourceType)
}