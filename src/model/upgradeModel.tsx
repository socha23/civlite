import { Action, action } from "./action"
import { UpgradeDefinition, UpgradeDefinitions, UpgradeType } from "./upgrade"
import { GameModel } from "./gameModel"
import { SoundType } from "../view/sounds"
import { spawnActionCompleted, spawnRollUp } from "../view/actionEffects"

const DECAY = {
    [UpgradeType.Init]: 0,
    [UpgradeType.Research]: 0.75,
    [UpgradeType.Pack]: 2.75,
}

const SOUNDS_ON_COMPLETE = {
    [UpgradeType.Init]: SoundType.ResearchComplete,
    [UpgradeType.Research]: SoundType.ResearchComplete,
    [UpgradeType.Pack]: SoundType.OpenPack,
}

export class UpgradeNode {
    model: GameModel
    definition: UpgradeDefinition
    completed: boolean = false
    action: Action

    timeSinceCompleted: number = 0

    constructor(model: GameModel, definition: UpgradeDefinition) {
        this.model = model
        this.definition = definition

        this.action = action({
            id: definition.id,

            exclusivityGroup: definition.exclusivityGroup || "research",

            timeCost: definition.timeCost,
            initialCost: () => definition.initialCost || [],
            workCost: definition.workCost,

            soundOnComplete: SOUNDS_ON_COMPLETE[this.type],

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
    
        if (this.type === UpgradeType.Pack) {
            spawnActionCompleted(this.action.id, 2.5, 16)
            spawnRollUp(this.action.id, 0.25, 2.5)
        }

        if (this.type === UpgradeType.Research) {
            spawnActionCompleted(this.action.id, 0.5, 1)
            spawnRollUp(this.action.id, 0.25, 0.5)
        }

    
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

    onTick(deltaS: number) {
        if (this.completed) {
            this.timeSinceCompleted += deltaS
        }
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

    visibleUpgrades(types: UpgradeType[]): UpgradeNode[] {
        return this.availableUpgrades.filter(n => 
            (n.timeSinceCompleted <= DECAY[n.type])
            && types.includes(n.type))
    }

    onTick(deltaS: number) {
        this.allNodesA.forEach(n => {n.onTick(deltaS)})
    }
}
