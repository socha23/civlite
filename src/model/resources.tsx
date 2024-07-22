export enum ResourceType {
    Food = "Food", 
    Forest = "Forest",
    Grassland = "Grassland",
    Herds = "Herds",
}

enum ResourceClass {
    Consumable = "Consumable",
    Assignable = "Assignable",
}


interface ResourceDefinition {
    class: ResourceClass,
    gatherTimeout: number,
    initialCap?: number,
    initialCount: number,
    assignable: boolean,
    initialAssigned: number,
}

export function resourceDefinition(type: ResourceType): ResourceDefinition {
    const result =  {
        class: ResourceClass.Consumable,
        gatherTimeout: 0,
        initialCap: undefined,
        initialCount: 0,
        initialAssigned: 0,
        ...ResourceDefinitions[type],
        assignable: false,
    }
    if (result.class === ResourceClass.Assignable) {
        result.assignable = true
    }
    return result
}

export const ResourceDefinitions = {
    [ResourceType.Herds]: {
        class: ResourceClass.Assignable,
        initialCount: 3,
    },
    [ResourceType.Food]: {
        gatherTimeout: 1, 
        initialCap: 30,    
    },
    [ResourceType.Forest]: {
        class: ResourceClass.Assignable,
        initialCount: 5,
        initialAssigned: 3,
    },
    [ResourceType.Grassland]: {
        class: ResourceClass.Assignable,
        initialCount: 5,
    },
}

export function allResourceTypes(): ResourceType[] {
    return Object.values(ResourceType)
}