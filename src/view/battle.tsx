import React from 'react';
import { Box } from './box'
import { GameModel } from '../model/gameModel'
import { PopType } from '../model/pops';
import { Colors, FontSizes, Icons, Labels } from './icons';
import { ActionProps, propsForAction, ActionButton, ActionRow } from './action';
import { formatNumber } from '../model/utils';
import { Force, Combatant } from '../model/battleModel';
import { LogProps, LogView, logProps } from './log';


type CombatantProps = {
  facingRight: boolean,
  type: PopType,
  count: number,
  initialCount: number,
}

type ForceProps = {
  title: string,
  color: string,
  facingRight: boolean,
  attacking: CombatantProps[],
  retreating: CombatantProps[],
}

export type BattleProps = {
  title: string,
  attacker: ForceProps,
  defender: ForceProps,
  round: number,
  nextRound: ActionProps,
  log: LogProps,
}

function combatantProps(c: Combatant, facingRight: boolean) {
  return {
    facingRight: facingRight,
    type: c.type,
    count: c.count,
    initialCount: c.initialCount
  }
}

function forceProps(force: Force, facingRight: boolean): ForceProps {
  return {
    title: force.title,
    color: force.color,
    facingRight: facingRight,
    attacking: force.activeCombatants.map(c => combatantProps(c, facingRight)),
    retreating: force.inactiveCombatants.map(c => combatantProps(c, !facingRight)),
  }
}

export function battleProps(model: GameModel): BattleProps {
  const b = model.testBattle.battle
  return {
    title: b.title,
    attacker: forceProps(b.attacker, true),
    defender: forceProps(b.defender, false),
    round: b.round,
    nextRound: propsForAction(model, model.testBattle.nextRoundAction, {

    }),
    log: logProps(b.log),
  }
}


type DudeProps = {
  facingRight: boolean,
  type: PopType, 
  alive: boolean,
}

export const SingleDudeView = (p: DudeProps) => <div style={{
  color: p.alive ? Colors.default : Colors.grayedOut,
  width: 12,
}}>
  <i className={Icons[p.type] + (p.facingRight ? "" : " fa-flip-horizontal")}/>
</div>

const DUDES_PER_COLUMN = 10

function dudeProps(p: CombatantProps): DudeProps[][] {
  let currentColumn: DudeProps[] = []
  const result = [currentColumn]
  for (let i = 0; i < p.initialCount; i++) {

    const alive = p.facingRight ? i >= (p.initialCount -  p.count)
      : i < p.count

    currentColumn.push({type: p.type, alive: alive, facingRight: p.facingRight})
    if ((i + 1) % DUDES_PER_COLUMN === 0) {
      currentColumn = []
      result.push(currentColumn)
    }
  }
  return result
}

const CombatantView = (p: CombatantProps) => <div style={{
  display: "flex",
}}>
  {
    dudeProps(p).map((r, rIdx) => <div key={rIdx} style ={{
      display: "flex",
      flexDirection: "column",

    }}> 
      {r.map((d, idx) => <SingleDudeView key={idx} {...d}/>)}
      </div>)
  }
</div>

const ForceView = (p: ForceProps) => <div style={{
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  padding: 4,
  alignItems: p.facingRight ? "end" : "start",
  fontSize: FontSizes.normal,
}}>
  <div style={{paddingBottom: 4, color: p.color}}>
    {p.title}
  </div>
  <div style={{
    width: "100%",
    display: "flex",
    flexDirection: p.facingRight ? "row-reverse" : "row",
  }}>
    {p.attacking.map((c, idx) => <CombatantView key={idx} {...c}/>)}
    <div style={{flexGrow: 1}}/>
    {p.retreating.map((c, idx) => <CombatantView key={idx} {...c}/>)}
  </div>

</div>

export const BattleView = (p: BattleProps) =>
  <Box>
    <div className="dottedDividersParent" style={{
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{
        paddingTop: 4,
        paddingBottom: 4,
        fontSize: FontSizes.normalPlus,
        textAlign: "center",
      }}>
          <div>{p.title}</div>
      </div>
      <div style={{
        paddingTop: 4,
        paddingBottom: 4,
        display: "flex",
        alignItems: "center",
      }}>
        <div>
          Round: {p.round}
        </div>
        <div style={{flexGrow: 1}}/>
          <div style={{width: 80}}>
            <ActionButton title="Next Round" {...p.nextRound}/>
          </div>
      </div>
      <div 
        className='dottedHorizontalDividersParent'
        style={{
          display: "flex",
        }}>
        <ForceView {...p.attacker}/>
        <ForceView {...p.defender}/>
      </div>
      <div style={{
      width: "100%",
      height: 100,
      paddingTop: 4,
    }}>
      <LogView {...p.log}/>
    </div>
    </div>
  </Box>


