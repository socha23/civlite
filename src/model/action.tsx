import { addTickListener } from "./timer"
import { CostElem } from "./costs"

export type ActionParams = {
    timeout?: number
    costs?: CostElem[]
    gains?: CostElem[]
}

export interface GameModelInterface {
    filterUnsatisfiableCosts(cost: CostElem[]): CostElem[]
    onProduce(cost: CostElem[]): void
    onConsume(cost: CostElem[]): void
}


export abstract class Action {
    timeout?: number
    timeoutLeft: number = 0
    costs: CostElem[]
    gains: CostElem[]
    inProgress: boolean = false
    checker?: GameModelInterface

    constructor({timeout, costs = [], gains=[]}: ActionParams) {
        this.timeout = timeout      
        this.costs = costs  
        this.gains = gains
        addTickListener(this)
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
        this.checker!.onConsume(this.costs)
        this.inProgress = true
    }

    onComplete() {
        this.checker!.onProduce(this.gains)
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

