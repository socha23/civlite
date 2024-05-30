import { addTickListener } from "./timer"

export type ActionParams = {
    timeout?: number
    costs: CostElem[]
}


export interface CostElem {
}

export interface ActionCostChecker {
    filterUnsatisfiableCosts(cost: CostElem[]): CostElem[]
    payCosts(cost: CostElem[]): void
}

export abstract class Action {
    timeout?: number
    timeoutLeft: number = 0
    costs: CostElem[]

    constructor({timeout, costs = []}: ActionParams) {
        this.timeout = timeout      
        this.costs = costs  
        addTickListener(this)
    }

    abstract _onAction(): void

    onAction(checker: ActionCostChecker) {
        if (this.timeoutLeft > 0) {
            return
        }
        if (checker.filterUnsatisfiableCosts(this.costs).length > 0) {
            return
        }
        checker.payCosts(this.costs)
        this._onAction()
        if (this.timeout) {
            this.timeoutLeft = this.timeout
        }
    }

    onTick(deltaS: number) {
        this.timeoutLeft = Math.max(0, this.timeoutLeft - deltaS)
    }

    disabled(checker: ActionCostChecker): any {
        if (checker.filterUnsatisfiableCosts(this.costs).length > 0) {
            return "Cost can't be paid"
        }
        return false
    }
}

