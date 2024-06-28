import { Labels, LogMessages } from "../view/icons"
import { Action, action } from "./action"
import { Log } from "./log"
import { PopType } from "./pops"


type CombatantParams = {
    type: PopType 
    count: number
}


enum CombatantState {
    Fighting = 0,
    Retreat = 1,
    WipedOut = 2,
}

const INITIAL_MORALE = 80
const MORALE_CHECK_TRESHOLD = 0.8

class Combatant {
    type: PopType
    morale = INITIAL_MORALE
    initialCount: number
    count: number
    force: Force
    state = CombatantState.Fighting

    constructor(type: PopType, count: number, force: Force) {
        this.type = type
        this.initialCount = count
        this.count = count
        this.force = force
    }

    get description() {
        return LogMessages.CombatantDescription(this.force.ours ? LogMessages.OwnershipOurs : LogMessages.OwnershipEnemy, this.type)
    }

    get active() {
        return this.state === CombatantState.Fighting
    }

    rollInitiative(): number {
        return Math.random()
    }

    rollSingleDamage(defender: Combatant) {
        if (Math.random() > 0.9) {
            return 1
        } else {
            return 0
        }
    }

    rollMorale(): number {
        return Math.floor(Math.random() * 100)
    }

    rollDamage(defender: Combatant) {        
        let result = 0
        for (let i = 0; i < this.count; i++) {
            result += this.rollSingleDamage(defender)
        }
        return result
    }

    applyMoraleEffects(log: Log) {
        if (this.count / this.initialCount < MORALE_CHECK_TRESHOLD) {
            const roll = this.rollMorale()
            log.trace(LogMessages.MoraleCheck(this.description, this.morale, roll))
            if (this.morale < roll) {
                log.info(LogMessages.RunsAway(this.description))
                this.state = CombatantState.Retreat
            }
        }
    }


    receiveDamage(attacker: Combatant, damage: number) {
        const perished = damage // scaling here
        const actuallyPerished = Math.min(this.count, perished)
        this.count -= actuallyPerished
        if (this.count === 0) {
            this.state = CombatantState.WipedOut
        }
        return actuallyPerished
    }
}

export class Force {
    title: string
    ours: boolean
    combatants: Combatant[]

    constructor(title: string, ours: boolean, combatants: CombatantParams[]) {
        this.title = title
        this.ours = ours
        this.combatants = combatants.map(p => new Combatant(p.type, p.count, this))
    }

    get activeCombatants() {
        return this.combatants.filter(c => c.active)
    }

    findDefender(attacker: Combatant): Combatant | undefined {
        const a = this.activeCombatants
        if (a.length === 0) {
            return undefined
        }
        return a[0]
    }

    get hasActiveCombatants() {
        return this.combatants.find(c => c.active) !== undefined
    }

}

enum BattleState {
    Active = 0,
    BattleOver = 1,
}

class Battle {
    state = BattleState.Active
    title: string
    attacker: Force
    defender: Force
    round: number = 0
    log: Log = new Log

    constructor(title: string, attacker: Force, defender: Force) {
        this.title = title
        this.attacker = attacker
        this.defender = defender
    }

    rollInitiative(combatants: Combatant[]) {
        const initiative = new Map<Combatant, number>()
        this.activeCombatants.forEach(c => {
            const i = c.rollInitiative()
            this.log.trace(LogMessages.RolledInitiative(c.description, i))  
            initiative.set(c, i)
        })
        combatants.sort((a, b) => initiative.get(b)!! - initiative.get(a)!!)
    }

    combatantTakesRound(c: Combatant) {
        const opposingForce = c.force === this.attacker ? this.defender : this.attacker
        const defender = opposingForce.findDefender(c)
        if (defender) {
            const roll = c.rollDamage(defender)
            const casulties = defender.receiveDamage(c, roll)
            this.log.info(LogMessages.CombatantAttacks(c.description, defender.description, roll, casulties))
        }

    }

    nextRound() {
        this.round++
        this.log.info("------------------------------")
        this.log.info(LogMessages.BattleRoundBegins(this.round))
        this.log.info("------------------------------")

        let combatants = this.activeCombatants
        this.rollInitiative(combatants)
        combatants.forEach(c => {
            this.combatantTakesRound(c)
        })
        combatants.forEach(c => {
            c.applyMoraleEffects(this.log)
        })

        if (!this.attacker.hasActiveCombatants) {
            this.victory(this.defender)
        } else if (!this.defender.hasActiveCombatants) {
            this.victory(this.attacker)
        }
    }

    victory(force: Force) {
        this.state = BattleState.BattleOver
        this.log.info("------------------------------")
        this.log.info(LogMessages.SideWon(force.title))
        this.log.info("------------------------------")

    }


    get activeCombatants() {
        return [
            ...this.attacker.activeCombatants,
            ...this.defender.activeCombatants,
        ]
    }
}


class BattleModel {
    battle: Battle
    nextRoundAction: Action
    
    constructor(battle: Battle) {
      this.battle = battle
      this.nextRoundAction = action({
            action: () => {this.battle.nextRound()},
            disabled: () => {return this.battle.state !== BattleState.Active},
        })  
    }
}

export function testBattleModel() {
    return new BattleModel(
        new Battle(
            "Test battle",
            new Force("War party", true, [
                {type: PopType.Brave, count: 50}
            ]),
            new Force("Opposing Force", false, [
                {type: PopType.Brave, count: 45}
            ]),
        )
    )
}