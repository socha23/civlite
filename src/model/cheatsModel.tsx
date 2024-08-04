import { spawnEffectAwards } from "../view/effects"
import { action } from "./action"
import { resources } from "./amount"
import { GameModel } from "./gameModel"
import { ResourceType } from "./resources"
import { UpgradeDefinitions } from "./upgrade"

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
            id: "totalResearch",
            onComplete: () => {
                UpgradeDefinitions.forEach(e => {
                    this.completeUpgrade([e.id])
                })
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
