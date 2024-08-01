import { Action, action } from "./action"
import { ResourceType, resourceDefinition } from "./resources"
import { Amount, ResourceAmount, isResourceAmount, isResourceType, resources } from "./amount"
import { ResearchDefinition, ResearchDefinitions } from "./research"
import { GameModel } from "./gameModel"

class ResearchNode {
    model: GameModel
    definition: ResearchDefinition
    completed: boolean = false
    action: Action

    constructor(model: GameModel, definition: ResearchDefinition) {
        this.model = model
        this.definition = definition

        this.action = action({
            id: definition.id,

            timeCost: definition.timeCost,
            initialCost: definition.initialCost,
            workCost: definition.workCost,

            onComplete: (self, model) => {
                this.completed = true
                if (this.definition.onComplete) {
                    this.definition.onComplete(this.model)
                }
                model.log.info((this.definition.logTitle || this.definition.title) + " discovered")
            },

            disabled: (model) => this.disabled()
        })
    }

    get available() {
        return this.prerequisitesMet && !this.completed
    }

    get prerequisitesMet(): boolean {
        const requiredResearch = this.definition.requiredResearch || []
        console.log(requiredResearch)
        let result = true
        requiredResearch.forEach(r => {
            if (!this.model.research.node(r).completed)
                result = false
        })
        return result
    }

    disabled() {
        return !this.prerequisitesMet && this.completed
    }

    get title() {
        return this.definition.title
    }

    get description() {
        return this.definition.description || ""
    }
}

export class ResearchModel {
    model: GameModel
    nodes = new Map<string, ResearchNode>
    nodesA = [] as ResearchNode[]

    constructor(model: GameModel) {
        this.model = model
        ResearchDefinitions.forEach(def => {
            const node = new ResearchNode(model, def)
            this.nodes.set(def.id, node)
            this.nodesA.push(node)
        })
    }

    node(id: string): ResearchNode {
        return this.nodes.get(id)!!
    }

    get availableResearch(): ResearchNode[] {
        return this.nodesA.filter(n => n.available)
    }
}
