import React from 'react';
import { Box } from './box'
import { GameModel } from '../model/gameModel'
import { PopType } from '../model/pops';
import { Colors, FontSizes, Icons, Labels } from './icons';
import { ActionProps, propsForAction, ActionButton, ActionRow } from './action';
import { formatNumber } from '../model/utils';
import { Force } from '../model/battleModel';
import { LogProps, LogView, logProps } from './log';


type CombatantProps = {
  type: PopType,
  count: number,
  initialCount: number,
}

type ForceProps = {
  title: string,
  attacker: boolean,
  combatants: CombatantProps[],
}

export type BattleProps = {
  title: string,
  attacker: ForceProps,
  defender: ForceProps,
  round: number,
  nextRound: ActionProps,
  log: LogProps,
}

function forceProps(force: Force, attacker: boolean): ForceProps {
  return {
    title: force.title,
    attacker: attacker,
    combatants: force.combatants.map(c => ({
      type: c.type,
      count: c.count,
      initialCount: c.initialCount
    }))
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
  type: PopType, 
  alive: boolean,
}

export const SingleDudeView = (p: DudeProps) => <div style={{
  color: p.alive ? Colors.default : Colors.grayedOut,
  width: 12,
}}>
  <i className={Icons[p.type]}/>
</div>

const DUDES_PER_ROW = 10

function dudeProps(p: CombatantProps): DudeProps[][] {
  let currentRow: DudeProps[] = []
  const result = [currentRow]
  for (let i = 0; i < p.initialCount; i++) {
    currentRow.push({type: p.type, alive: i < p.count})
    if ((i + 1) % DUDES_PER_ROW === 0) {
      currentRow = []
      result.push(currentRow)
    }
  }
  return result
}

const CombatantView = (p: CombatantProps) => <div style={{
  display: "flex",
  flexDirection: "column",
}}>
  {
    dudeProps(p).map((r, rIdx) => <div key={rIdx} style ={{
      display: "flex",
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
  alignItems: p.attacker ? "end" : "start",
  fontSize: FontSizes.normal,
}}>
  <div style={{paddingBottom: 4}}>
    {p.title}
  </div>
  {p.combatants.map((c, idx) => <CombatantView key={idx} {...c}/>)}
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
        {p.title}
      </div>
      <div style={{
        paddingTop: 4,
        paddingBottom: 4,
      }}>
        Round: {p.round}
      </div>
      <div 
        className='dottedHorizontalDividersParent'
        style={{
          display: "flex"
        }}>
        <ForceView {...p.attacker}/>
        <ForceView {...p.defender}/>
      </div>
    </div>
    <div style={{paddingTop: 4}}>
      <ActionButton title="Next Round" {...p.nextRound}/>
    </div>
    <LogView {...p.log}/>
    </Box>


