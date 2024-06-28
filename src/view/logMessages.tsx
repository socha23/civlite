import React, { ReactNode } from 'react';
import { Combatant, Force } from '../model/battleModel';
import { Labels } from './icons';


export const BattleMessages = {
    RoundBegins: (p: {round: number}) => <div style={{marginTop: 4, textDecoration: "underline"}}>
        Round {p.round} begins.
    </div>,
    CombatantAttacks: (p: {attacker: ReactNode, defender: ReactNode, casulties: number}) => <span>
        {p.attacker} attack {p.defender}. {p.casulties > 0 ? p.casulties + " perish." : ""}
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
