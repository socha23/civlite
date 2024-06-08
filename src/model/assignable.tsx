import { PopType } from "./pops";

export interface Assigned {
    type: PopType,
    count: number,
}

export class Assignable {
    assignableTypes: PopType[]
    assignedPops: Record<string, number> = {}

    constructor(assignableTypes: PopType[]) {
        this.assignableTypes = assignableTypes
        assignableTypes.forEach(t => {
            this.assignedPops[PopType[t]] = 0
        })
    }

    get assignedCounts(): Assigned[] {
        return this.assignableTypes.map(t => ({
            type: t,
            count: this.assignedCount(t)
        }))
    }

    assign(popType: PopType) {
        this.assignedPops[PopType[popType]]++
    }

    canUnassign(t: PopType) {
        return this.assignedCount(t) > 0
    }

    unassign(popType: PopType) {
        const typeS = PopType[popType]
        if (typeS in this.assignedPops) {
            this.assignedPops[typeS]--
        } else {
            throw `No pops of type ${popType} assigned`
        }
    }

    assignedCount(popType: PopType): number {
        return this.assignedPops[PopType[popType]] || 0
    }
}