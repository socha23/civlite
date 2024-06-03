import { Action, ActionParams } from "./action"
import { ResourceType, ResourceDefinitions } from "./resources"
import { CostElem, Resources } from "./costs"

class ResourceModel {
    type: ResourceType
    count: number = 0
    gatherAction: GatherResourceAction

    constructor(type: ResourceType) {
        this.type = type
        this.gatherAction = new GatherResourceAction(this, {timeout: ResourceDefinitions[type].gatherTimeout})
    }

    onPlayerProduction() {
        this.onProduce(1)
    }

    onProduce(amount: number) {
        this.count = Math.min(this.count + amount, this.cap)
    }

    onConsume(amount: number) {
        this.count = Math.max(0, this.count - amount)
    }

    get cap() {
        return ResourceDefinitions[this.type].initialCap
    }
}

export class ResourcesModel {
    food = new ResourceModel(ResourceType.Food)
    labor = new ResourceModel(ResourceType.Labor)

    resource(type: ResourceType): ResourceModel {
        switch (type) {
            case ResourceType.Food:
                return this.food
            case ResourceType.Labor:
                return this.labor
            default:
                throw `Unknown resource type ${type}`
        }
    }

    filterUnsatisfiableCosts(costs: CostElem[]): CostElem[] {
        return costs.filter(c => (c instanceof Resources) &&
            c.count > this.resource(c.type).count
        )
    }

    payCosts(costs: CostElem[]) {
        costs.forEach(c => {
            if (c instanceof Resources) {
                this.resource(c.type).count -= c.count
            }
        })
    }
}


class GatherResourceAction extends Action {
    resource: ResourceModel

    constructor(resource: ResourceModel, params: ActionParams) {
        super(params)
        this.resource = resource
    }

    _onAction() {
        this.resource.onPlayerProduction()
    }
}

