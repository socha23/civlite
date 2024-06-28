import { Labels, LogMessages } from "../view/icons"
import { Action, action } from "./action"
import { Log } from "./log"
import { PopType } from "./pops"


type CombatantParams = {
    type: PopType 
    count: number
}

class Combatant {
    type: PopType
    initialCount: number
    count: number
    force: Force

    constructor(type: PopType, count: number, force: Force) {
        this.type = type
        this.initialCount = count
        this.count = count
        this.force = force
    }

    get description() {
        return LogMessages.CombatantDescription(this.force.ours ? LogMessages.OwnershipOurs : LogMessages.OwnershipEnemy, this.type)
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

    rollDamage(defender: Combatant) {
        
//        return Math.ceil(this.count * Math.random() * 0.1)
        // separate roll per combatant
        
        let result = 0
        for (let i = 0; i < this.count; i++) {
            result += this.rollSingleDamage(defender)
        }
        return result
        
    }


    receiveDamage(attacker: Combatant, damage: number) {
        const perished = damage // scaling here
        const actuallyPerished = Math.min(this.count, perished)
        this.count -= actuallyPerished
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
        return this.combatants.filter(c => c.count > 0)
    }

    findDefender(attacker: Combatant): Combatant | undefined {
        const a = this.activeCombatants
        if (a.length === 0) {
            return undefined
        }
        return a[0]
    }

}

class Battle {
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

    }

    get activeCombatants() {
        return [
            ...this.attacker.combatants,
            ...this.defender.combatants,
        ]
    }
}


class BattleModel {
    battle: Battle
    nextRoundAction: Action
    
    constructor(battle: Battle) {
      this.battle = battle
      this.nextRoundAction = action({
        action:() => {this.battle.nextRound()}
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