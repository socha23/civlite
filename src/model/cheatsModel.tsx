import { action } from "./action"
import { GameModel } from "./gameModel"

export class CheatsModel {
    model: GameModel

    applyCheatsActions = [
        action({
            id: "basicResearch",
            onComplete: () => {
                this.completeResearch([
                    "enable_calendar",
                    "enable_insight",
                    "enable_food_gathering",
                    "basic_tribe",
                    "upgrade_manual_food_collection",
                    "enable_idler_insight",
                ])
            }
        })
    ]

    constructor(model: GameModel) {
        this.model = model
    }

    completeResearch(nodeIds: string[]) {
        nodeIds.forEach(n => {
            this.model.research.node(n).complete()
        })
    }
}
