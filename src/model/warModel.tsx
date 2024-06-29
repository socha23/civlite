import { Labels } from "../view/icons"
import { Action, action } from "./action"
import { Battle, BattleModel, Force } from "./battleModel"
import { CivModel } from "./civsModel"
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
    MarchBackHome = 3,
    Retreat = 4,
    Returned = 5,
    Completed = 6,
}

export type ExpectedOpposition = {
    type: PopType
    range: InclusiveIntRange
}

function expectedOpposition(goal: WarType, civ: CivModel) {
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
    type: PopType | ResourceType
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
    currentBattle?: BattleModel
    goal: WarType

    army: ArmyModel
    against: CivModel

    state: WarState = WarState.BeforeMarch

    expectedOpposition: ExpectedOpposition[]
    expectedRewards: ExpectedRewards[]

    marchAction: Action
    cancelAction: Action
    completeAction: Action

    constructor(goal: WarType, army: ArmyModel, against: CivModel) {
        this.goal = goal
        this.army = army
        this.against = against

        this.expectedOpposition = expectedOpposition(goal, against)
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

    get enemyStrengthFrom() {
        return warTypeDefinition(this.goal).againstStrengthFrom * this.against.strength
    }

    get enemyStrengthTo() {
        return warTypeDefinition(this.goal).againstStrengthTo * this.against.strength
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