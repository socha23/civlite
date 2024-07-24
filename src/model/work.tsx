export enum WorkType {
    Labor = "Labor",
    Insight = "Insight",
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
