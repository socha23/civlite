import { Labels } from "../view/icons"
import { Battle, BattleModel, Force } from "./battleModel"
import { WarType } from "./wars"


interface WarSide {    
    force: Force
}



export default class WarModel {
    currentBattle?: BattleModel
    type: WarType
    attacker: WarSide
    defender: WarSide

    constructor(type: WarType, attacker: WarSide, defender: WarSide) {
        this.type = type
        this.attacker = attacker
        this.defender = defender

        this.initBattle()
    }

    initBattle() {
        this.currentBattle = new BattleModel(new Battle(
            Labels[this.type],
            this.attacker.force,
            this.defender.force
        ))
    }
}