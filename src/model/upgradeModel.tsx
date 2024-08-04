import { Action, action } from "./action"
import { UpgradeDefinition, UpgradeDefinitions, UpgradeType } from "./upgrade"
import { GameModel } from "./gameModel"
import { SoundType } from "../view/sounds"


export class UpgradeNode {
    model: GameModel
    definition: UpgradeDefinition
    completed: boolean = false
    action: Action

    constructor(model: GameModel, definition: UpgradeDefinition) {
        this.model = model
        this.definition = definition

        this.action = action({
            id: definition.id,

            exclusivityGroup: definition.exclusivityGroup || "research",

            timeCost: definition.timeCost,
            initialCost: definition.initialCost,
            workCost: definition.workCost,

            soundOnComplete: SoundType.ResearchComplete,

            onComplete: (self, model) => {
                this.complete()
            },

            disabled: (model) => this.disabled()
        })
    }

    complete() {
        if (this.completed) {
            return
        }
        this.completed = true
        if (this.definition.onComplete) {
            this.definition.onComplete(this.model)
        }
        this.model.log.info(this.definition.title + " discovered")
    }

    get type(): UpgradeType {
        return this.definition.type || UpgradeType.Research
    }

    get available() {
        return this.prerequisitesMet && !this.completed
    }

    get prerequisitesMet(): boolean {
        const requiredResearch = this.definition.requiredUpgrades || []
        let result = true
        requiredResearch.forEach(r => {
            if (!this.model.upgrades.node(r).completed)
                result = false
        })
        return result
    }

    disabled() {
        return !this.prerequisitesMet || this.completed
    }

    get title() {
        return this.definition.title
    }

    get description() {
        return this.definition.description || ""
    }

    get flavorText() {
        return this.definition.flavorText || ""
    }
}

export class UpgradeModel {

    availableUpgrades: UpgradeNode[] = []
    model: GameModel
    allNodes = new Map<string, UpgradeNode>
    allNodesA = [] as UpgradeNode[]

    constructor(model: GameModel) {
        this.model = model
        UpgradeDefinitions.forEach(def => {
            const node = new UpgradeNode(model, def)
            this.allNodes.set(def.id, node)
            this.allNodesA.push(node)
        })
    }

    addAvailableUpgrade(id: string) {
        this.availableUpgrades.push(this.node(id))
    }

    node(id: string): UpgradeNode {
        return this.allNodes.get(id)!!
    }

    uncompletedAvailableUpgrades(type: UpgradeType): UpgradeNode[] {
        return this.availableUpgrades.filter(n => !n.completed && n.type === type)
    }
}
