import { Action, ActionParams } from "./action"
import { ResourceType, ResourceDefinitions } from "./resources"
import { CostElem, Resources } from "./costs"

class ResourceModel {
    type: ResourceType
    count: number = 0
    gatherAction: GatherResourceAction

    constructor(type: ResourceType) {
        this.type = type
        this.count = ResourceDefinitions[type].initialCount
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

    resources = Object.values(ResourceType).map(type => new ResourceModel(type))

    resource(type: ResourceType): ResourceModel {
        return this.resources.find(m => m.type === type)!
    }

    filterUnsatisfiableCosts(costs: CostElem[]): CostElem[] {
        return costs.filter(c => (c instanceof Resources) &&
            c.count > this.resource(c.type).count
        )
    }

    onConsume(costs: CostElem[]) {
        costs.forEach(c => {
            if (c instanceof Resources) {
                this.resource(c.type).count -= c.count
            }
        })
    }

    onProduce(values: CostElem[]) {
        values.forEach(v => {
            if (v instanceof Resources) {
                this.resource(v.type).onProduce(v.count)
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

