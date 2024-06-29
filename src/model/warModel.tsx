import { Labels } from "../view/icons"
import { Action, action } from "./action"
import { Battle, BattleModel, Force } from "./battleModel"
import { CivModel } from "./civsModel"
import { ArmyModel } from "./militaryModel"
import { addTickListener } from "./timer"
import { WarType } from "./wars"


export enum WarState {
    Cancelled = -1,
    BeforeMarch = 0,
    March = 1,
    Battle = 2,
    MarchBackHome = 3,
    Retreat = 4,
    Returned = 5,
    Completed = 6,
}

export class War {
    currentBattle?: BattleModel
    goal: WarType

    army: ArmyModel
    against: CivModel

    state: WarState = WarState.BeforeMarch

    marchAction: Action
    cancelAction: Action
    completeAction: Action

    constructor(goal: WarType, army: ArmyModel, against: CivModel) {
        this.goal = goal
        this.army = army
        this.against = against
        
        this.marchAction = action({
            action: () => {
                this.state = WarState.March
            },
            disabled: () => {
                return this.state !== WarState.BeforeMarch
            },
            onComplete: () => {
                this.state = WarState.Returned
            },
            timeout: 6, 
        })

        this.cancelAction = action({
            action: () => {
                this.state = WarState.Cancelled
            },
        })

        this.completeAction = action({
            action: () => {
                this.state = WarState.Completed
            },
        })
        
    }

    initBattle() {
        /*
        this.currentBattle = new BattleModel(new Battle(
            Labels[this.type],
            this.attacker.force,
            this.defender.force
        ))
            */
    }
}

export class WarModel {
    
    _wars: War[] = []

    constructor() {
        addTickListener(this)
    }

    ongoingWarsAgainst(c: CivModel) {
        return this._wars.filter(w => w.against === c)
    }

    ongoingWarsFoughtBy(a: ArmyModel) {
        return this._wars.filter(w => w.army === a)
    }

    startWar(goal: WarType, army: ArmyModel, against: CivModel) {
        const w = new War(
            goal,
            army,
            against
        )
        army.engagedIn = w
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

    startWarAction(goal: WarType, army: ArmyModel, against: CivModel) {
        return action({
            action: () => {
                this.startWar(goal, army, against)
            },
            disabled: () => {
                return this.ongoingWarsFoughtBy(army).length > 0
                || this.ongoingWarsAgainst(against).length > 0
            },
        })
    }

}