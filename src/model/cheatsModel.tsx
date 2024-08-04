import { spawnEffectAwards } from "../view/effects"
import { action } from "./action"
import { resources } from "./amount"
import { GameModel } from "./gameModel"
import { ResourceType } from "./resources"

export class CheatsModel {
    model: GameModel

    applyCheatsActions = [
        action({
            id: "upToPrimitive",
            onComplete: () => {
                this.completeUpgrade([
                    "enable_insight",
                    "enable_calendar",
                    "enable_food_gathering",
                ])
                this.model.resources.food.add(20)
            }
        }),

        action({
            id: "basicResearch",
            onComplete: () => {
                this.completeUpgrade([
                    "enable_insight",
                    "enable_calendar",
                    "enable_food_gathering",

                    "research_pack_primitive",
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

    completeUpgrade(nodeIds: string[]) {
        nodeIds.forEach(n => {
            this.model.upgrades.node(n).complete()
        })
    }
}
