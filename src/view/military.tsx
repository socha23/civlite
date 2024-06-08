import React from 'react';
import { Box } from './box'
import { GameModel } from '../model/gameModel'
import { PopType } from '../model/pops';
import { FontSizes, Icons, Labels } from './icons';
import { ActionProps, propsForAction, ActionButton } from './action';
import { WarState } from '../model/militaryModel';
import { formatNumber } from '../model/utils';



export type ArmyElement = {
  type: PopType,
  count: number,
  assignAction: ActionProps,
  unassignAction: ActionProps,
}

export type ArmyProps = {
  title: string,
  elements: ArmyElement[],
  startWarAction: ActionProps,
  currentWar?: WarProps
}

export type WarProps = {
  state: WarState,
  againstTitle: string,
  duration: number,
  durationLeft: number,
  completeAction: ActionProps,
}

export type MilitaryProps = {
  armies: ArmyProps[]
}


export function militaryProps(model: GameModel): MilitaryProps {
  return {
     armies: model.military.armies.map(a => ({
      title: a.title,
      startWarAction: propsForAction(model, a.startWarAction, {
        title: Labels.StartWar
      }),
      currentWar: a.war ? {
        againstTitle: a.war.against.title,
        state: a.war.state,
        duration: a.war.duration,
        durationLeft: a.war.durationLeft,
        completeAction: propsForAction(model, a.war.completeAction, {
          title: Labels.CompleteWar
        })
      } : undefined,
      elements: a.elements.map(e => ({
        type: e.type,
        count: a.assignedCount(e.type),
        assignAction: propsForAction(model, e.assignAction),
        unassignAction: propsForAction(model, e.unassignAction),
      })
      ),
    }))
  }
}


const ArmyElementView = (e: ArmyElement) => <div style={{
  display: "flex",
  alignItems: "center",
  gap: 4,
  fontSize: FontSizes.normal
}}>
  <div style={{width: 14, textAlign: "right"}}>
    <i className={Icons[e.type]}/>
  </div>
  <div style={{width: 60,}}>
    {Labels.Plural[e.type]}
  </div>
  <div  style={{width: 20, textAlign: "right"}}>
    {e.count}
  </div>
  <div style={{width: 20, height: 20,}}>
    <ActionButton {...e.assignAction} title='+'/>
  </div>
  <div style={{width: 20, height: 20,}}>
    <ActionButton {...e.unassignAction} title='-'/>
  </div>
</div>

const WarView = (w: WarProps) => <div style={{
  display: "flex",
  flexDirection: "column",
}}>
  <div>War against {w.againstTitle}</div>
  <div>
    Duration left: {formatNumber(w.durationLeft)} state: {w.state}
  </div>
  <div>
    <ActionButton {...w.completeAction}/>
  </div>
</div>

const ArmyView = (a: ArmyProps) => <div style={{
  display: "flex",
  flexDirection: "column",
  gap: 4,
  marginTop: 8,
}}>
  <div style={{
    fontSize: FontSizes.big
  }}>
  {a.title}
  </div>
  <div>
    {a.elements.map(e => <ArmyElementView key={e.type} {...e}/>)}
  </div>
  <div>
    <ActionButton {...a.startWarAction}/>
  </div>
  {a.currentWar && <WarView {...a.currentWar}/>}
</div>

export const MilitaryView = (p: MilitaryProps) =>
  <Box>
    {p.armies.map((a, idx) => <ArmyView key={idx} {...a}/>)} 
  </Box>


