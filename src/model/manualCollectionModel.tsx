import { action, Action } from "./action";
import { resources, work } from "./amount";
import { ResourceType } from "./resources";
import { WorkType } from "./work";

export class ManualCollectionModel {
    collectFood: Action
    collectInsight: Action
    collectLabor: Action

    constructor() {

        this.collectFood = action({
            id: "collect_food",
            expectedRewards: [resources(ResourceType.Food, 1)],
            timeCost: 3,
            exclusivityGroup: "manualCollection"
        })
        this.collectInsight = action({
            id: "collect_insight",
            expectedRewards: [work(WorkType.Insight, 1)],
            timeCost: 3,
            exclusivityGroup: "manualCollection"
        })
        this.collectLabor = action({
            id: "collect_labor",
            expectedRewards: [work(WorkType.Labor, 1)],
            timeCost: 5,
            exclusivityGroup: "manualCollection"
        })
    }
}