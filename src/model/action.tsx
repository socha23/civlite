import { addTickListener } from "./timer"
import { Amount } from "./amount"

export type ActionParams = {
    timeout?: number
    costs?: Amount[]
    rewards?: Amount[]
}

export interface GameModelInterface {
    filterUnsatisfiableCosts(cost: Amount[]): Amount[]
    onProduce(cost: Amount[]): void
    onConsume(cost: Amount[]): void
}


export abstract class Action {
    timeout?: number
    timeoutLeft: number = 0
    costs: Amount[]
    rewards: Amount[]
    inProgress: boolean = false
    checker?: GameModelInterface

    constructor({timeout, costs = [], rewards = []}: ActionParams) {
        this.timeout = timeout      
        this.costs = costs  
        this.rewards = rewards
        if (this.timeout) {
            addTickListener(this)
        }
    }

    abstract _onAction(): void

    _isDisabled(): any {
        return false
    }

    _onComplete(): void {

    }

    onAction(checker: GameModelInterface) {
        if (this.timeoutLeft > 0) {
            return
        }
        if (checker.filterUnsatisfiableCosts(this.costs).length > 0) {
            return
        }
        this.checker = checker
        this.onStart()
        this._onAction()
        if (this.timeout) {
            this.timeoutLeft = this.timeout
        } else {
            this.onComplete()
        }
    }

    onTick(deltaS: number) {
        this.timeoutLeft = Math.max(0, this.timeoutLeft - deltaS)
        if (this.inProgress && this.timeoutLeft === 0) {
            this.onComplete()
        }
    }

    onStart() {
        if (this.costs.length > 0) {
            this.checker!.onConsume(this.costs)
        }
        this.inProgress = true
    }

    onComplete() {
        if (this.rewards.length > 0) {
            this.checker!.onProduce(this.rewards)
        }
        this.inProgress = false
        this._onComplete()

    }

    disabled(checker: GameModelInterface): any {
        if (checker.filterUnsatisfiableCosts(this.costs).length > 0) {
            return "Cost can't be paid"
        }
        return this._isDisabled()
    }
}

class InlineAction extends Action {
    action?: () => void
    __onComplete?: () => void
    _disabled?: () => any
    
    constructor(p: ActionParams & {
        action?: () => void,
        onComplete?: () => void,
        disabled?: () => any,
    }) {
        super(p)
        this.action = p.action
        this.__onComplete = p.onComplete
        this._disabled = p.disabled
    }

    _onAction(): void {
        if (this.action) {
            this.action()
        }
    }

    _onComplete(): void {
        if (this.__onComplete) {
            this.__onComplete()
        }
    }

    _isDisabled() {
        if (!this._disabled) {
            return false
        }
        return this._disabled()
    }
}

export function action(p: ActionParams & {
    action?: () => void,
    onComplete?: () => void,
    disabled?: () => any,
}): Action {
    return new InlineAction(p);
}

