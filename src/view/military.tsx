import React from 'react';
import { Box } from './box'
import { GameModel } from '../model/gameModel'
import { PopType } from '../model/pops';
import { FontSizes, Icons, Labels } from './icons';
import { ActionProps, propsForAction, ActionButton } from './action';



export type ArmyElement = {
  type: PopType,
  count: number,
  assignAction: ActionProps,
  unassignAction: ActionProps,
}

export type ArmyProps = {
  title: string,
  elements: ArmyElement[],
}

export type MilitaryProps = {
  armies: ArmyProps[]
}


export function militaryProps(model: GameModel): MilitaryProps {
  return {
    armies: model.military.armies.map(a => ({
      title: a.title,
      elements: a.elements.map(e => ({
        type: e.type,
        count: a.assignedCount(e.type),
        assignAction: propsForAction(model, e.assignAction, {
        }),
        unassignAction: propsForAction(model, e.unassignAction, {
        }),
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

const ArmyView = (a: ArmyProps) => <div>
  <div style={{
    fontSize: FontSizes.big
  }}>
    {a.title}
    <div style={{marginTop: 4}}>
      {a.elements.map(e => <ArmyElementView key={e.type} {...e}/>)}
    </div>
  </div>
</div>

export const MilitaryView = (p: MilitaryProps) =>
  <Box>
    {p.armies.map((a, idx) => <ArmyView key={idx} {...a}/>)} 
  </Box>


