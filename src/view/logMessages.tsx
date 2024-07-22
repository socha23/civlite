import React, { ReactNode } from 'react';
import { Combatant, Force } from '../model/battleModel';
import { Labels } from './icons';
import { AnimalType } from '../model/huntingModel';
import { HuntingLabels } from './labels';
import { PopType } from '../model/pops';


export const BattleMessages = {
    RoundBegins: (p: {round: number}) => <div style={{marginTop: 4, textDecoration: "underline"}}>
        Round {p.round} begins.
    </div>,
    CombatantCloseAttacks: (p: {attacker: ReactNode, defender: ReactNode, casulties: number}) => <span>
        {p.attacker} attack {p.defender}. {p.casulties > 0 ? p.casulties + " perish." : ""}
    </span>,
    CombatantRangedAttacks: (p: {attacker: ReactNode, defender: ReactNode, casulties: number}) => <span>
        {p.attacker} shoot {p.defender}. {p.casulties > 0 ? p.casulties + " perish." : ""}
    </span>,
    CombatantWipedOut: (p: {combatant: ReactNode}) => <span>
        {p.combatant} are wiped out!
    </span>,
    CombatantRetreats: (p: {combatant: ReactNode}) => <span>
        {p.combatant} break and retreat!
    </span>,
    SideWon: (p: {side: ReactNode}) => <span>
        {p.side} won!
    </span>,
    CombatantDescription: (p: {combatant: Combatant}) => <span style={{color: p.combatant.color}}>
        {Labels.Plural[p.combatant.type]}
    </span>,
    ForceDescription: (p: {force: Force}) => <span style={{color: p.force.color}}>
        {p.force.title}
    </span>,

}

export const HuntingMessages = {
    HuntComplete: (p: {animalType: AnimalType, count: number}) => <span>
            Gatherers have caught {p.count} {HuntingLabels[p.animalType]}. 
        </span>,
}

export const HungerMessages = {
    HungerDeaths: (p: {type: PopType, count: number}) => <span>
            {p.count} {Labels.Plural[p.type]} die of hunger.
        </span>,
}
