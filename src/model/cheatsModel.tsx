import { spawnEffectAwards } from "../view/effects"
import { action } from "./action"
import { resources } from "./amount"
import { GameModel } from "./gameModel"
import { ResourceType } from "./resources"

export class CheatsModel {
    model: GameModel

    applyCheatsActions = [
        action({
            id: "spawnEffect",
            onComplete: () => {
                spawnEffectAwards("spawnEffect", [resources(ResourceType.Food, Math.ceil(5 * Math.random()))])
            }
        }),

        action({
            id: "basicResearch",
            onComplete: () => {
                this.completeUpgrade([
                    "enable_calendar",
                    "enable_insight",
                    "research_pack_primitive",
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

    completeUpgrade(nodeIds: string[]) {
        nodeIds.forEach(n => {
            this.model.upgrades.node(n).complete()
        })
    }
}
