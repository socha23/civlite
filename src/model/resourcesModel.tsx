import { Action, action } from "./action"
import { ResourceType, resourceDefinition } from "./resources"
import { Amount, Resources, resources } from "./costs"

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
            timeout: resDef.gatherTimeout,
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
            throw "Can't assign, not enough left"
        }
        this.assigned += amount
    }

    unassign(amount: number) {
        if (this.assigned < amount) {
            throw "Can't unassign, not enough assigned"
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
        return costs.filter(c => (c instanceof Resources) && !this.resource(c.resourceType).canPay(c))
    }

    pay(costs: Amount[]) {
        costs.forEach(c => {
            if (c.resourceType) {
                this.resource(c.resourceType).pay(c)
            }
        })
    }

    gain(values: Amount[]) {
        values.forEach(c => {
            if (c.resourceType) {
                this.resource(c.resourceType).gain(c)
            }
        })
    }
}
