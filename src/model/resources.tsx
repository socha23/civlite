export enum ResourceType {
    Insight = "Insight",
    Food = "Food", 
    Labor = "Labor",
    Forest = "Forest",
    Grassland = "Grassland",
    Herds = "Herds",

}

export const ResourceDefinitions = {
    [ResourceType.Herds]: {
        gatherTimeout: 1, 
        initialCap: 3,    
        initialCount: 3,
    },
    [ResourceType.Food]: {
        gatherTimeout: 1, 
        initialCap: 30,    
        initialCount: 0,
    },
    [ResourceType.Insight]: {
        gatherTimeout: 3, 
        initialCap: 10,    
        initialCount: 0,
    },
    [ResourceType.Labor]: {
        gatherTimeout: 5,
        initialCap: 10,
        initialCount: 0,
    },
    [ResourceType.Forest]: {
        gatherTimeout: 1,
        initialCap: 30,
        initialCount: 21,
    },
    [ResourceType.Grassland]: {
        gatherTimeout: 1,
        initialCap: 5,
        initialCount: 5,
    },
}

export function allResourceTypes(): ResourceType[] {
    return Object.values(ResourceType)
}