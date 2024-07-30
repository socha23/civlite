export enum WorkType {
    Labor = "Labor",
    Insight = "Insight",
    Gathering = "Gathering",
    Hunting = "Hunting",
}

export const WorkDefinitions = {
    [WorkType.Insight]: {
        gatherTimeout: 3, 
    },
    [WorkType.Labor]: {
        gatherTimeout: 5,
    },
}
