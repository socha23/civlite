import React, { ReactNode } from 'react';
import { Box } from './box'
import { GameModel } from '../model/gameModel'
import { PopType } from '../model/pops';
import { ArmyLabels, FontSizes, Icons, Labels } from './icons';
import { ActionProps, propsForAction, ActionButton, ActionRow } from './action';
import { formatNumber } from '../model/utils';
import { popLabelPlural } from './labels';




export type ArmyElement = {
  type: PopType,
  count: number,
  assignAction: ActionProps,
  unassignAction: ActionProps,
}

export type ArmyProps = {
  title: string,
  elements: ArmyElement[],
  status: ReactNode,
}

export type MilitaryProps = {
  armies: ArmyProps[]
}

export function militaryProps(model: GameModel): MilitaryProps {
  return {
     armies: model.military.armies.map(a => ({
      title: a.title,
      status: a.engagedIn 
        ? <ArmyLabels.ArmyAssignmentWar goal={a.engagedIn.goal} against={a.engagedIn.against.title} />
        : <ArmyLabels.ArmyAssignmentIdle/>,
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
    {popLabelPlural(e.type)}
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

const ArmyView = (a: ArmyProps) => <div className="dottedDividersParent" style={{
  display: "flex",
  flexDirection: "column",
  gap: 4,
  marginTop: 8,
}}>
  <div style={{
    fontSize: FontSizes.big,
    paddingBottom: 4,
  }}>
  {a.title}
  </div>
  <div style={{
    paddingBottom: 4,
  }}>
    {a.status
     }
  </div>
  <div>
    {a.elements.map(e => <ArmyElementView key={e.type} {...e}/>)}
  </div>
</div>

export const MilitaryView = (p: MilitaryProps) =>
  <Box>
    {p.armies.map((a, idx) => <ArmyView key={idx} {...a}/>)} 
  </Box>


