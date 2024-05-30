import { Action, ActionParams, CostElem } from "./action"

class Resources implements CostElem {
    type: ResourceType
    count: number

    constructor(type: ResourceType, count: number) {
        this.type = type
        this.count = count
    }
}

export enum ResourceType {
    Food,
    Labor,
}

export class ResourceModel {
    type: ResourceType
    count: number = 0

    constructor(type: ResourceType) {
        this.type = type
    }

    onPlayerProduction() {
        this.count += 1
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

export function resources(type: ResourceT   ype, count: number) {
    return new Resources(type, count)
}

export class GatherResourceAction extends Action {
    resource: ResourceModel

    constructor(resource: ResourceModel, params: ActionParams) {
        super(params)
        this.resource = resource
    }

    _onAction() {
        this.resource.onPlayerProduction()
    }
}

