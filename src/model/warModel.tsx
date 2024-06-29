import { Labels } from "../view/icons"
import { action } from "./action"
import { Battle, BattleModel, Force } from "./battleModel"
import { CivModel } from "./civsModel"
import { ArmyModel } from "./militaryModel"
import { WarType } from "./wars"


interface WarSide {    
    force: Force
}

export class War {
    currentBattle?: BattleModel
    goal: WarType

    army: ArmyModel
    against: CivModel

    constructor(goal: WarType, army: ArmyModel, against: CivModel) {
        this.goal = goal
        this.army = army
        this.against = against
        this.initBattle()
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