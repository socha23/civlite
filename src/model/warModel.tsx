import { BattleLabels, Labels } from "../view/icons"
import { Action, action } from "./action"
import { Battle, BattleState, Combatant, Force } from "./battleModel"
import { CivModel } from "./civsModel"
import { Amount, ItemType, isPopAmount, isResourceAmount, pops, resources } from "./costs"
import { GameModel } from "./gameModel"
import { ArmyModel } from "./militaryModel"
import { PopType } from "./pops"
import { ResourceType } from "./resources"
import { addTickListener } from "./timer"
import { InclusiveIntRange } from "./utils"
import { WarType, warTypeDefinition } from "./wars"


export enum WarState {
    Cancelled = -1,
    BeforeMarch = 0,
    March = 1,
    Battle = 2,
    AfterBattleAttackerWon = 3,
    AfterBattleAttackerLost = 4,
    MarchBackHome = 5,
    Retreat = 6,
    Returned = 7,
    Completed = 8,
}

export type ExpectedOpposition = {
    type: PopType
    range: InclusiveIntRange
}

function expectedOpposition(goal: WarType, civ: CivModel): ExpectedOpposition[] {
    const popTypes = [PopType.Brave]
    const warDef = warTypeDefinition(goal)
    return popTypes.map(t => {
        return {
            type: t,
            range: new InclusiveIntRange(civ.strength * warDef.againstStrengthFrom, civ.strength * warDef.againstStrengthTo)    
        }
    })
}

export type ExpectedRewards = {
    type: ItemType 
    range: InclusiveIntRange
}

function expectedRewards(goal: WarType, civ: CivModel) {
    const warDef = warTypeDefinition(goal)
    return warDef.rewards.map(t => {
        return {
            type: t.type,
            range: new InclusiveIntRange(civ.population * t.from, civ.population * t.to)     
        }
    })
}

export class War {
    currentBattle?: Battle
    goal: WarType

    model: GameModel
    army: ArmyModel
    against: CivModel

    state: WarState = WarState.BeforeMarch

    expectedOpposition: ExpectedOpposition[]
    opposingForce: Force

    expectedRewards: ExpectedRewards[]
    rewards: Amount[] = []

    marchAction: Action
    cancelAction: Action

    fightAction: Action
    retreatAction: Action
    marchBackHomeAction: Action

    completeAction: Action

    attackerWon = false
    attackerLost = false

    constructor(goal: WarType, model: GameModel, army: ArmyModel, against: CivModel) {
        this.goal = goal
        this.model = model
        this.army = army
        this.against = against

        this.expectedOpposition = expectedOpposition(goal, against)
        this.opposingForce = new Force(
            BattleLabels.EnemyLabel, 
            this.against.color, 
            this.expectedOpposition.map(e => pops(e.type, e.range.randomValue()))
        )

        this.expectedRewards = expectedRewards(goal, against)
        
        this.marchAction = action({
            action: () => {
                this.state = WarState.March
                this.army.engagedIn = this
            },
            disabled: () => {
                return this.state !== WarState.BeforeMarch && this.state !== WarState.March
            },
            onComplete: () => {
                this.state = WarState.Battle
                this.startBattle()
            },
            timeout: 1, 
        })

        this.cancelAction = action({
            action: () => {
                this.state = WarState.Cancelled
            },
        })

        this.fightAction = action({
            action: () => {
                if (this.currentBattle) {
                    this.currentBattle.nextRound()
                }
            },
            disabled: () => {
                return this.state !== WarState.Battle
            },
        })   
        this.retreatAction = action({
            action: () => {
                this.state = WarState.Retreat
            },
            disabled: () => {
                return this.state !== WarState.AfterBattleAttackerLost && this.state !== WarState.Retreat
            },
            onComplete: () => {
                this.state = WarState.Returned
            },
            timeout: 1, 
        })   
        this.marchBackHomeAction = action({
            action: () => {
                this.state = WarState.MarchBackHome
            },
            disabled: () => {
                return this.state !== WarState.AfterBattleAttackerWon && this.state !== WarState.MarchBackHome
            },
            onComplete: () => {
                this.state = WarState.Returned
            },
            timeout: 1, 
        })   
        this.completeAction = action({
            action: () => {
                this.state = WarState.Completed
                this.onWarCompleted()
            },
        })   

    }

    onBattleCompleted(attackerWon: boolean) {
        this.attackerWon = attackerWon
        this.attackerLost = !attackerWon

        this.state = attackerWon ? WarState.AfterBattleAttackerWon : WarState.AfterBattleAttackerLost

        if (attackerWon) {
            this.rewards = this.expectedRewards.map(e => {
                if (isPopAmount(e)) {
                    return pops(e.type, e.range.randomValue())
                } else if (isResourceAmount(e)) {
                    return resources(e.type, e.range.randomValue())
                } else {
                    throw "Unknown reward type"
                }
            })
        }
    }

    onWarCompleted() {
        if (this.attackerWon) {
            this.model.onProduce(this.rewards)
        }
    }

    startBattle() {
        this.currentBattle = new Battle(
            Labels[this.goal],
            this.army.force(),
            this.opposingForce,
        (b) => {this.onBattleCompleted(b)})
    }
}

export class WarModel {
    
    _wars: War[] = []
    model: GameModel

    constructor(model: GameModel) {
        addTickListener(this)
        this.model = model
    }

    ongoingWarsAgainst(c: CivModel) {
        return this._wars
            .filter(w => w.against === c)
        }

    ongoingWarsFoughtBy(a: ArmyModel) {
        return this._wars
            .filter(w => w.army === a)
    }

    startWar(goal: WarType, army: ArmyModel, against: CivModel) {
        const w = new War(
            goal,
            this.model,
            army,
            against
        )
        this._wars.push(w)
    }

    onTick(deltaS: number) {
        const activeWars: War[] = [] 
        this._wars.forEach(w => {
            if (w.state === WarState.Completed || w.state == WarState.Cancelled) {
                w.army.engagedIn = undefined
            } else {
                activeWars.push(w)
            }
        })
        this._wars = activeWars        
    }

    cancelUnstartedWars() {
        this._wars.forEach(w => {
            if (w.state === WarState.BeforeMarch) {
                w.state = WarState.Cancelled
            }
        })
    }

    startWarAction(goal: WarType, army: ArmyModel, against: CivModel) {
        return action({
            action: () => {
                this.cancelUnstartedWars()
                this.startWar(goal, army, against)
            },
            disabled: () => {
                return this.ongoingWarsFoughtBy(army)
                    .filter(w => w.state > WarState.BeforeMarch)
                    .length > 0
                || this.ongoingWarsAgainst(against)
                    .filter(w => w.state > WarState.BeforeMarch)
                    .length > 0
            },
        })
    }

}