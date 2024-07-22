import { BattleLabels, Labels } from "../view/icons"
import { Action, action } from "./action"
import { Battle, Force } from "./battleModel"
import { CivModel } from "./civsModel"
import { Amount, ExpectedAmount, ExpectedPopAmount, rollActualAmount } from "./amount"
import { GameModel } from "./gameModel"
import { ArmyModel } from "./militaryModel"
import { PopType } from "./pops"
import { addTickListener } from "./timer"
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

function expectedOpposition(goal: WarType, civ: CivModel): ExpectedPopAmount[] {
    const popTypes = [PopType.Brave]
    const warDef = warTypeDefinition(goal)
    return popTypes.map(t => {
        return {
            type: t,
            from: civ.strength * warDef.againstStrengthFrom,
            to: civ.strength * warDef.againstStrengthTo,
        }
    })
}

function expectedRewards(goal: WarType, civ: CivModel): ExpectedAmount[] {
    const warDef = warTypeDefinition(goal)
    return warDef.rewards.map(t => {
        return {
            type: t.type,
            from: civ.population * t.from,
            to:  civ.population * t.to
        }
    })
}

let warAutoinc = 0

export class War {
    model: GameModel

    goal: WarType
    army: ArmyModel
    against: CivModel
    state: WarState = WarState.BeforeMarch
    attackerWon = false

    expectedOpposition: ExpectedPopAmount[]
    opposingForce: Force

    expectedRewards: ExpectedAmount[]
    rewards: Amount[] = []
    
    currentBattle?: Battle

    id = warAutoinc++
    actions: {
        march: Action,
        cancel: Action,
        fight: Action,
        retreat: Action,
        marchBackHome: Action,
        complete: Action,
    }

    constructor(goal: WarType, model: GameModel, army: ArmyModel, against: CivModel) {
        this.goal = goal
        this.model = model
        this.army = army
        this.against = against

        this.actions = {
            march: action({
                id: `war_march_${this.id}`,
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
                timeCost: army.marchDuration,
            }),
            cancel: action({
                id: `war_cancel_${this.id}`,
                action: () => {
                    this.state = WarState.Cancelled
                },
            }),
            fight: action({
                id: `war_fight_${this.id}`,
                action: () => {
                    if (this.currentBattle) {
                        this.currentBattle.nextRound()
                    }
                },
                disabled: () => {
                    return this.state !== WarState.Battle
                },
            }),
            retreat: action({
                id: `war_retreat_${this.id}`,
                action: () => {
                    this.state = WarState.Retreat
                },
                disabled: () => {
                    return this.state !== WarState.AfterBattleAttackerLost && this.state !== WarState.Retreat
                },
                onComplete: () => {
                    this.state = WarState.Returned
                },
                timeCost: army.marchDuration,
            }),
            marchBackHome: action({
                id: `war_marchBack_${this.id}`,
                action: () => {
                    this.state = WarState.MarchBackHome
                },
                disabled: () => {
                    return this.state !== WarState.AfterBattleAttackerWon && this.state !== WarState.MarchBackHome
                },
                onComplete: () => {
                    this.state = WarState.Returned
                },
                timeCost: army.marchDuration,
            }),
            complete: action({
                id: `war_complete_${this.id}`,
                action: () => {
                    this.state = WarState.Completed
                    this.onWarCompleted()
                },
            }),
        }
        this.expectedOpposition = expectedOpposition(goal, against)
        this.opposingForce = new Force(
            BattleLabels.EnemyLabel, 
            this.against.color, 
            this.expectedOpposition.map(e => rollActualAmount(e))
        )
        this.expectedRewards = expectedRewards(goal, against)
    }

    onBattleCompleted(attackerWon: boolean) {
        if (attackerWon) {
            this.attackerWon = attackerWon
            this.state = WarState.AfterBattleAttackerWon
            this.rewards = this.expectedRewards.map(e => rollActualAmount(e))
        } else {
            this.state = WarState.AfterBattleAttackerLost
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
        this.model = model
        addTickListener(this)
    }

    ongoingWarsAgainst(c: CivModel) {
        return this._wars.filter(w => w.against === c)
        }

    ongoingWarsFoughtBy(a: ArmyModel) {
        return this._wars.filter(w => w.army === a)
    }

    startWar(goal: WarType, army: ArmyModel, against: CivModel) {
        this.cancelUnstartedWars()
        this._wars.push(new War(goal, this.model, army, against))
    }

    onTick(deltaS: number) {
        this.cleanupCompletedAndCancelledWars()
    }

    cleanupCompletedAndCancelledWars() {
        const activeWars: War[] = [] 
        this._wars.forEach(w => {
            if (w.state === WarState.Completed || w.state === WarState.Cancelled) {
                // war needs cleanup
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
            id: `war_start`,
            action: () => {this.startWar(goal, army, against)},
            disabled: () => {
                return this.ongoingWarsFoughtBy(army)
                    //.filter(w => w.state > WarState.BeforeMarch)
                    .length > 0
                || this.ongoingWarsAgainst(against)
                    //.filter(w => w.state > WarState.BeforeMarch)
                    .length > 0
            },
        })
    }
}