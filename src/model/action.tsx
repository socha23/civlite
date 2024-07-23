import { Amount, AmountsAccumulator, ExpectedAmount, SingleAmountAccumulator, WorkAmount, isAmount, rollActualAmount } from "./amount"
import { WorkType } from "./work"
import { exclusiveActionsInProgress, registerInProgressAction, unregisterInProgressAction } from "./actionsModel"
import { spawnEffectAwards } from "../view/effects"
import { GameModel } from "./gameModel"


type ActionRewards = (Amount | ExpectedAmount)[]

type PossiblyLazyActionRewards = ActionRewards |  ((m: GameModel) => ActionRewards)

export type ActionParams = {
    id: string
    exclusivityGroup?: string
    initialCost?: Amount[]
    workCost?: WorkAmount[]
    timeCost?: number

    expectedRewards?: PossiblyLazyActionRewards
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

export function unlazyRewards(rewards: PossiblyLazyActionRewards, model: GameModel) : ActionRewards {
    if (Array.isArray(rewards)) {
        return rewards
    } else {
        return rewards(model)
    }
}

function rollRewards(rewards: ActionRewards): Amount[] {
    return rewards.map(r => {
        if (isAmount(r)) {
            return r
        } else {
            return rollActualAmount(r)
        }
    })
}

export abstract class Action {
    id: string
    initialCost: Amount[]
    workAcc: AmountsAccumulator
    timeAcc: SingleAmountAccumulator 
    expectedRewards: ActionRewards | ((m: GameModel) => ActionRewards)
    expectedRewardsAtStart?: ActionRewards
    actualRewards: Amount[] = []
    state: ActionState = ActionState.Ready
    exclusivityGroup?: string

    constructor({id, initialCost = [], workCost = [], expectedRewards = [], timeCost, exclusivityGroup}: ActionParams) {
        this.id = id
        this.initialCost = initialCost  
        this.exclusivityGroup = exclusivityGroup
        this.expectedRewards = expectedRewards
        this.timeAcc = new SingleAmountAccumulator(timeCost || 0)
        this.workAcc = new AmountsAccumulator(workCost)
    }

    abstract _onAction(): void

    _isDisabled(model: GameModel): any {
        return false
    }

    _onComplete(model: GameModel): void {

    }

    get inProgress() {
        return this.state === ActionState.InProgress
    }

    onAction(model: GameModel) {
        if (this.state !== ActionState.Ready) {
            return
        }
        if (model.filterUnsatisfiableCosts(this.initialCost).length > 0) {
            return
        }
        this.onStart(model)
        this._onAction()
        this._checkCompletion(model)
    }

    onTick(model: GameModel, deltaS: number) {
        if (this.state === ActionState.InProgress && this.timeAcc) {
            this.timeAcc.add(deltaS)
            this._checkCompletion(model)
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


    onWork(type: WorkType, amount: number, model: GameModel) {
        this.workAcc.add(type, amount)
        this._checkCompletion(model)
    }

    _checkCompletion(model: GameModel) {
        if (this.workAcc.completed && this.timeAcc.completed) {
            this.onComplete(model)
        }
    }

    onStart(model: GameModel) {
        this.expectedRewardsAtStart = unlazyRewards(this.expectedRewards, model)
        if (this.initialCost.length > 0) {
            model.onConsume(this.initialCost)
        }
        this.workAcc.reset()
        this.timeAcc.reset()
        registerInProgressAction(this)
        this.state = ActionState.InProgress
    }

    onComplete(model: GameModel) {
        this.actualRewards = rollRewards(this.expectedRewardsAtStart!!)
        unregisterInProgressAction(this)

        // internal onComplete called after actual awards are rolled, but before they go into effect, to allow modification 
        this._onComplete(model)

        this.workAcc.reset()
        if (this.actualRewards.length > 0) {
            spawnEffectAwards(this.id, this.actualRewards)
            model.onProduce(this.actualRewards)
        }
        this.state = ActionState.Ready
        this.expectedRewardsAtStart = undefined

    }

    disabled(model: GameModel): any {
        if (exclusiveActionsInProgress(this)) {
            return "Exclusive actions in progress"
        }
        if (model.filterUnsatisfiableCosts(this.initialCost).length > 0) {
            return "Initial cost can't be paid"
        }
        return this._isDisabled(model)
    }

    get completionRatio() {
        return Math.min(this.workAcc.completionRatio, this.timeAcc.completionRatio)
    }
}

class InlineAction extends Action {
    action?: () => void
    __onComplete?: (self: InlineAction) => void
    _disabled?: (model: GameModel) => any
    
    constructor(p: ActionParams & {
        action?: () => void,
        onComplete?: (self: InlineAction) => void,
        disabled?: (model: GameModel) => any,
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

    _onComplete(model: GameModel): void {
        if (this.__onComplete) {
            this.__onComplete(this)
        }
    }

    _isDisabled(model: GameModel) {
        if (!this._disabled) {
            return false
        }
        return this._disabled(model)
    }
}

export function action(p: ActionParams & {
    action?: () => void,
    onComplete?: (self: Action) => void,
    disabled?: (model: GameModel) => any,
}): Action {
    return new InlineAction(p);
}

