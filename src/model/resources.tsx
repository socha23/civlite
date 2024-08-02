export enum ResourceType {
    Food = "Food", 

    WildAnimalsSmall = "WildAnimalsSmall",
    WildAnimalsBig = "WildAnimalsBig",

    Forest = "Forest",
    Grassland = "Grassland",
    Herds = "Herds",
}

enum ResourceClass {
    Consumable = "Consumable",
    Assignable = "Assignable",
}

export const ResourceDefinitions = {
    [ResourceType.Herds]: {
        class: ResourceClass.Assignable,
        initialCount: 3,
    },
    [ResourceType.Food]: {
        initialCap: 30,    
    },
    [ResourceType.WildAnimalsSmall]: {
        initialCap: 0,    
    },
    [ResourceType.WildAnimalsBig]: {
        initialCap: 0,    
    },
    [ResourceType.Forest]: {
    },
    [ResourceType.Grassland]: {
        class: ResourceClass.Assignable,
        initialCount: 5,
    },
}

interface ResourceDefinition {
    class: ResourceClass,
    initialCap?: number,
    initialCount: number,
    assignable: boolean,
    initialAssigned: number,
}

export function resourceDefinition(type: ResourceType): ResourceDefinition {
    const result =  {
        class: ResourceClass.Consumable,
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

export function allResourceTypes(): ResourceType[] {
    return Object.values(ResourceType)
}