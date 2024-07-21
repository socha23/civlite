import { addTickListener, removeTickListener } from "./timer"
import { Amount, AmountsAccumulator, SingleAmountAccumulator, WorkAmount } from "./amount"
import { WorkType } from "./work"

export type ActionParams = {
    initialCost?: Amount[]
    workCost?: WorkAmount[]
    timeCost?: number

    rewards?: Amount[]
}

export interface GameModelInterface {
    filterUnsatisfiableCosts(cost: Amount[]): Amount[]
    onProduce(cost: Amount[]): void
    onConsume(cost: Amount[]): void
}


export enum ActionState {
    Ready = 0,
    InProgress = 1,
} 

export abstract class Action {
    initialCost: Amount[]
    workAcc: AmountsAccumulator
    timeAcc: SingleAmountAccumulator 
    rewards: Amount[]
    checker?: GameModelInterface
    state: ActionState = ActionState.Ready

    constructor({initialCost = [], workCost = [], rewards = [], timeCost}: ActionParams) {
        this.initialCost = initialCost  
        this.rewards = rewards
        this.timeAcc = new SingleAmountAccumulator(timeCost || 0)
        this.workAcc = new AmountsAccumulator(workCost)
    }

    abstract _onAction(): void

    _isDisabled(): any {
        return false
    }

    _onComplete(): void {

    }

    onAction(checker: GameModelInterface) {
        if (this.state !== ActionState.Ready) {
            return
        }
        if (checker.filterUnsatisfiableCosts(this.initialCost).length > 0) {
            return
        }
        this.checker = checker
        this.onStart()
        this._onAction()
        this._checkCompletion()
    }

    onTick(deltaS: number) {
        if (this.state === ActionState.InProgress && this.timeAcc) {
            this.timeAcc.add(deltaS)
            this._checkCompletion()
        }
    }

    get workLeft() {
        return this.workAcc.missing
    }

    onWork(type: WorkType, amount: number) {
        this.workAcc.add(type, amount)
        this._checkCompletion()
    }

    _checkCompletion() {
        if (this.workAcc.completed && this.timeAcc.completed) {
            this.onComplete()
        }
    }

    onStart() {
        if (this.initialCost.length > 0) {
            this.checker!.onConsume(this.initialCost)
        }
        this.workAcc.reset()
        this.timeAcc.reset()
        addTickListener(this)
        this.state = ActionState.InProgress
    }

    onComplete() {
        if (this.rewards.length > 0) {
            this.checker!.onProduce(this.rewards)
        }
        this.state = ActionState.Ready
        this.workAcc.reset()
        removeTickListener(this)
        this._onComplete()

    }

    disabled(checker: GameModelInterface): any {
        if (checker.filterUnsatisfiableCosts(this.initialCost).length > 0) {
            return "Initial cost can't be paid"
        }
        return this._isDisabled()
    }

    get completionRatio() {
        return this.workAcc.completionRatio
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

