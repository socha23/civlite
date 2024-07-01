import { Colors } from "../view/icons"
import { BattleMessages } from "../view/logMessages"
import { Action, action } from "./action"
import { Log } from "./log"
import { PopType, popTypeDefinition } from "./pops"


type CombatantParams = {
    popType: PopType 
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
    closeAttackedBy: Combatant[] = []

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

    get hasRangedAttack() {
        return popTypeDefinition(this.type).rangedAttack > 0 
    }

    get hasCloseAttack() {
        return popTypeDefinition(this.type).closeAttack > 0 
    }

    get singleHp() {
        return popTypeDefinition(this.type).hp
    }

    singleCloseAttackDamage(defender: Combatant) {
        return popTypeDefinition(this.type).closeAttack
    }

    singleRangedAttackDamage(defender: Combatant) {
        return popTypeDefinition(this.type).rangedAttack
    }

    rollMorale(): number {
        return Math.floor(Math.random() * 100)
    }

    takeRound(opposingForce: Force, log: Log) {
        if (this.state !== CombatantState.Fighting) {
            return;
        }

        let defender: Combatant | undefined
        
        let rangedAttack = false
        let closeAttack = false

        const closeAttackersAlive = this.closeAttackedBy.filter(c => c.active)

        if (closeAttackersAlive.length > 0) {
            closeAttack = true
            defender = closeAttackersAlive[0]
        }

        if (!closeAttack && this.hasRangedAttack && opposingForce.activeCombatants.length > 0) {
            rangedAttack = true
            defender = opposingForce.activeCombatants[0]
        }

        if (!rangedAttack && this.hasCloseAttack && opposingForce.activeCombatants.length > 0) {
            closeAttack = true
            defender = opposingForce.activeCombatants[0]
        }

        if (rangedAttack && defender) {
            const roll = this.rollRangedAttackDamage(defender)
            const casulties = defender.receiveRangedDamage(this, roll)
            log.info(<BattleMessages.CombatantRangedAttacks 
                attacker={this.description}
                defender={defender.description}
                casulties={casulties}/>)    
        }

        if (closeAttack && defender) {
            const roll = this.rollCloseAttackDamage(defender)
            const casulties = defender.receiveCloseDamage(this, roll)
            log.info(<BattleMessages.CombatantCloseAttacks 
                attacker={this.description}
                defender={defender.description}
                casulties={casulties}/>)    
        }

        if (defender && defender.state === CombatantState.WipedOut) {
            log.info(<BattleMessages.CombatantWipedOut combatant={defender.description}/>)
        }

        this.closeAttackedBy = []
    }


    rollCloseAttackDamage(defender: Combatant) {        
        let result = 0
        for (let i = 0; i < this.count; i++) {
            if (Math.random()< DAMAGE_ROLL) {
                result += this.singleCloseAttackDamage(defender)
            } 
        }
        return result
    }

    rollRangedAttackDamage(defender: Combatant) {        
        let result = 0
        for (let i = 0; i < this.count; i++) {
            if (Math.random()< DAMAGE_ROLL) {
                result += this.singleRangedAttackDamage(defender)
            } 
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

    receiveCloseDamage(attacker: Combatant, damage: number) {
        this.closeAttackedBy.push(attacker)
        return this._receiveDamage(attacker, damage)
    }

    receiveRangedDamage(attacker: Combatant, damage: number) {
        return this._receiveDamage(attacker, damage)
    }

    _receiveDamage(attacker: Combatant, damage: number) {
        const perished = Math.ceil(damage / this.singleHp) // scaling here
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
        this.combatants = combatants.map(p => new Combatant(p.popType, p.count, this))
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

    get hasActiveCombatants() {
        return this.combatants.find(c => c.active) !== undefined
    }

}

export enum BattleState {
    Active = 0,
    AttackerWon = 1,
    AttackerLost = 2,
}

export class Battle {
    state = BattleState.Active
    title: string
    attacker: Force
    defender: Force
    round: number = 0
    log: Log = new Log
    onComplete: (attackerWon: boolean) => any
        
    constructor(title: string, attacker: Force, defender: Force, onComplete: (attackerWon: boolean) => any) {
        this.onComplete = onComplete
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
        const opposingForce = c.force === this.attacker ? this.defender : this.attacker
        c.takeRound(opposingForce, this.log)
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
        this.onComplete(force === this.attacker)
        this.state = force === this.attacker ? BattleState.AttackerWon : BattleState.AttackerLost
        this.log.info(<BattleMessages.SideWon side={force.description}/>)
    }

    get completed() {
        return this.state === BattleState.AttackerLost || this.state === BattleState.AttackerWon
    }

    get activeCombatants() {
        return [
            ...this.attacker.activeCombatants,
            ...this.defender.activeCombatants,
        ]
    }
}
