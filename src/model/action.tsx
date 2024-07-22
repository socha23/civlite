import { addTickListener, removeTickListener } from "./timer"
import { Amount, AmountsAccumulator, ExpectedAmount, SingleAmountAccumulator, WorkAmount, isAmount, rollActualAmount } from "./amount"
import { WorkType } from "./work"
import { exclusiveActionsInProgress, registerInProgressAction, unregisterInProgressAction } from "./actionsModel"
import { Amounts } from "../view/amount"

export type ActionParams = {
    exclusivityGroup?: string
    initialCost?: Amount[]
    workCost?: WorkAmount[]
    timeCost?: number

    rewards?: (Amount | ExpectedAmount)[]
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
    rewards: (Amount | ExpectedAmount)[]
    actualAwards: Amount[] = []
    checker?: GameModelInterface
    state: ActionState = ActionState.Ready
    exclusivityGroup?: string

    constructor({initialCost = [], workCost = [], rewards = [], timeCost, exclusivityGroup}: ActionParams) {
        this.initialCost = initialCost  
        this.exclusivityGroup = exclusivityGroup
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

    get inProgress() {
        return this.state === ActionState.InProgress
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

    get workCost() {
        return this.workAcc.required
    }

    needsWorkOfType(type: WorkType) {
        return this.workAcc.missingOfType(type) > 0
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
        registerInProgressAction(this)
        addTickListener(this)
        this.state = ActionState.InProgress
    }

    onComplete() {
        this.actualAwards = this.rewards.map(r => {
            if (isAmount(r)) {
                return r
            } else {
                return rollActualAmount(r)
            }
        })
        if (this.rewards.length > 0) {
            this.checker!.onProduce(this.actualAwards)
        }
        this.state = ActionState.Ready
        this.workAcc.reset()
        removeTickListener(this)
        unregisterInProgressAction(this)
        this._onComplete()

    }

    disabled(checker: GameModelInterface): any {
        if (exclusiveActionsInProgress(this)) {
            return "Exclusive actions in progress"
        }
        if (checker.filterUnsatisfiableCosts(this.initialCost).length > 0) {
            return "Initial cost can't be paid"
        }
        return this._isDisabled()
    }

    get completionRatio() {
        return Math.min(this.workAcc.completionRatio, this.timeAcc.completionRatio)
    }
}

class InlineAction extends Action {
    action?: () => void
    __onComplete?: (rewards: Amount[]) => void
    _disabled?: () => any
    
    constructor(p: ActionParams & {
        action?: () => void,
        onComplete?: (rewards: Amount[]) => void,
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
            this.__onComplete(this.actualAwards)
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
    onComplete?: (rewards: Amount[]) => void,
    disabled?: () => any,
}): Action {
    return new InlineAction(p);
}

