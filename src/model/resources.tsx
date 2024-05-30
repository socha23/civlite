import { Action, ActionParams, CostElem } from "./action"

export enum ResourceType {
    Food, Labor
}

export class Resources implements CostElem {
    type: ResourceType
    count: number

    constructor(type: ResourceType, count: number) {
        this.type = type
        this.count = count
    }
}

export function resources(type: ResourceType, count: number) {
    return new Resources(type, count)
}


const RESOURCE_DEFINITIONS = {
    [ResourceType.Food]: {gatherTimeout: 1},
    [ResourceType.Labor]: {gatherTimeout: 3},
}

class ResourceModel {
    type: ResourceType
    count: number = 0
    gatherAction: GatherResourceAction

    constructor(type: ResourceType) {
        this.type = type
        this.gatherAction = new GatherResourceAction(this, {timeout: RESOURCE_DEFINITIONS[type].gatherTimeout})
    }

    onPlayerProduction() {
        this.onProduce(1)
    }

    onProduce(amount: number) {
        this.count += amount
    }

    onConsume(amount: number) {
        this.count = Math.max(0, this.count - amount)
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

