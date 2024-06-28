import { Colors } from "../view/icons"
import { BattleMessages } from "../view/logMessages"
import { Action, action } from "./action"
import { Log } from "./log"
import { PopType, popTypeDefinition } from "./pops"


type CombatantParams = {
    type: PopType 
    count: number
}


enum CombatantState {
    Fighting = 0,
    Retreat = 1,
    WipedOut = 2,
}

const INITIAL_MORALE = 95
const MORALE_CHECK_TRESHOLD = 0.8
const DAMAGE_ROLL = 0.1

export class Combatant {
    type: PopType
    morale = INITIAL_MORALE
    initialCount: number
    count: number
    force: Force
    state = CombatantState.Fighting
    color: string = Colors.default

    constructor(type: PopType, count: number, force: Force) {
        this.type = type
        this.initialCount = count
        this.count = count
        this.force = force
        this.color = force.color
    }

    get battleOrder() {
        return popTypeDefinition(this.type).battleOrder * 100000 + this.initialCount
    }

    get description() {
        return <BattleMessages.CombatantDescription combatant={this}/>
    }

    get active() {
        return this.state === CombatantState.Fighting
    }

    rollInitiative(): number {
        return Math.random()
    }

    rollSingleDamage(defender: Combatant) {
        if (Math.random()< DAMAGE_ROLL) {
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
        if (!this.active) {
            // broken and wiped out units suffer no further morale effects
            return
        }

        if (this.count / this.initialCount < MORALE_CHECK_TRESHOLD) {
            const roll = this.rollMorale()
            if (this.morale < roll) {
                log.info(
                    <BattleMessages.CombatantRetreats combatant={this.description}/>
                )
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
    color: string = Colors.default
    combatants: Combatant[]

    constructor(title: string, color: string, combatants: CombatantParams[]) {
        this.title = title
        this.color = color
        this.combatants = combatants.map(p => new Combatant(p.type, p.count, this))
    }

    get activeCombatants() {
        const result = [ ...this.combatants.filter(c => c.active) ]
        result.sort((a, b) => a.battleOrder - b.battleOrder)
        return result
    }

    get inactiveCombatants() {
        const result = [ ...this.combatants.filter(c => !c.active) ]
        result.sort((a, b) => a.battleOrder - b.battleOrder)
        return result
    }

    get description() {
        return <BattleMessages.ForceDescription force={this}/>
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
            initiative.set(c, i)
        })
        combatants.sort((a, b) => initiative.get(b)!! - initiative.get(a)!!)
    }

    combatantTakesRound(c: Combatant) {
        if (c.state !==CombatantState.Fighting) {
            return;
        }
        const opposingForce = c.force === this.attacker ? this.defender : this.attacker
        const defender = opposingForce.findDefender(c)
        if (defender) {
            const roll = c.rollDamage(defender)
            const casulties = defender.receiveDamage(c, roll)
            this.log.info(<BattleMessages.CombatantAttacks 
                attacker={c.description}
                defender={defender.description}
                casulties={casulties}/>)
            if (defender.state === CombatantState.WipedOut) {
                this.log.info(<BattleMessages.CombatantWipedOut combatant={defender.description}/>)
            }
        }

    }

    nextRound() {
        this.round++
        this.log.info(<BattleMessages.RoundBegins round={this.round}/>)

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
        this.log.info(<BattleMessages.SideWon side={force.description}/>)
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
            new Force("War party", Colors.OurArmy, [
                {type: PopType.Brave, count: 15},
                {type: PopType.Brave, count: 10},
                {type: PopType.Brave, count: 5},
            ]),
            new Force("Opposing Force", Colors.EnemyArmy, [
                {type: PopType.Brave, count: 5},
                {type: PopType.Brave, count: 15},
                {type: PopType.Brave, count: 10},
            ]),
        )
    )
}