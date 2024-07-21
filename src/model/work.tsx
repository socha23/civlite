import { Action, action } from "./action"
import { ResourceType, resourceDefinition } from "./resources"
import { Amount, isResourceAmount, isResourceType, resources } from "./amount"

export enum WorkType {
    Labora = "Labora",
}

class ResourceModel {
    type: ResourceType
    count: number = 0
    assigned: number = 0
    assignable: boolean = false
    cap?: number
    gatherAction: Action

    constructor(type: ResourceType) {
        const resDef = resourceDefinition(type)
        this.type = type
        
        this.count = resDef.initialCount
        this.assigned = resDef.initialAssigned
        this.cap = resDef.initialCap
        this.assignable = resDef.assignable
 
        this.gatherAction = action({
            rewards: [resources(type, 1)],
            timeCost: resDef.gatherTimeout,
        })
    }

    onPlayerProduction() {
        this.add(1)
    }

    add(amount: number) {
        this.count += amount
        if (this.cap) {
            this.count = Math.min(this.count, this.cap)
        }
    }

    sub(amount: number) {
        this.count = Math.max(0, this.count - amount)
    }

    assign(amount: number) {
        if (this.count - this.assigned < amount) {
            throw new Error("Can't assign, not enough left")
        }
        this.assigned += amount
    }

    unassign(amount: number) {
        if (this.assigned < amount) {
            throw new Error("Can't unassign, not enough assigned")
        }
        this.assigned -= amount
    }

    get unassigned() {
        return this.count - this.assigned
    }

    canPay(c: Amount) {
        if (this.assignable) {
            return c.count <= this.unassigned 
        } else {
            return c.count <= this.count
        }
    }

    pay(c: Amount) {
        if (c.assignment) {
            this.assign(c.count)
        } else {
            this.sub(c.count)
        }
    }

    gain(c: Amount) {
        if (c.assignment) {
            this.unassign(c.count)
        } else {
            this.add(c.count)
        }
    }

}

export class ResourcesModel {

    resources = Object.values(ResourceType).map(type => new ResourceModel(type))

    resource(type: ResourceType): ResourceModel {
        return this.resources.find(m => m.type === type)!
    }

    filterUnsatisfiableCosts(costs: Amount[]): Amount[] {
        return costs.filter(c => isResourceAmount(c) && !this.resource(c.type).canPay(c))
    }

    pay(costs: Amount[]) {
        costs.forEach(c => {
            if (isResourceType(c.type)) {
                this.resource(c.type).pay(c)
            }
        })
    }

    gain(values: Amount[]) {
        values.forEach(c => {
            if (isResourceType(c.type)) {
                this.resource(c.type).gain(c)
            }
        })
    }
}
