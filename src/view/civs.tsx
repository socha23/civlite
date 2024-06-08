import React from 'react';
import { Box } from './box'
import { GameModel } from '../model/gameModel'
import { PopType } from '../model/pops';
import { Colors, FontSizes, Icons, Labels } from './icons';
import { ActionProps, propsForAction, ActionButton } from './action';
import { WarState } from '../model/militaryModel';
import { formatNumber } from '../model/utils';



type CivProps = {
  targetted: boolean,
  title: string,
  population: number,
  strength: number,
  targetAction: ActionProps,
}

export type CivsProps = {
  civs: CivProps[]
}


export function civsProps(model: GameModel): CivsProps {
  return {
     civs: model.civilizations.civs.map(c => ({
      title: c.title,
      population: c.population,
      strength: c.strength,
      targetAction: propsForAction(model, model.civilizations.targetAction(c), {
        title: Labels.Target,
        buttonLabel: <i className={Icons.target}/>
      }),
      targetted: model.civilizations.targetted === c,
     }))
  }
}

const CivStat = (p: {icon: string, value: number}) => <div style={{
  display: "flex",
  alignItems: "center",
  gap: 2,
}}>
  <i className={p.icon}/>
  <div>{p.value}</div>
</div>

const CivStats = (p: CivProps) => <div style={{
  fontSize: FontSizes.small,
  display: "flex",
  gap: 6,
  alignItems: "center",
}}>
  <CivStat icon={Icons.population} value={p.population}/>
  <CivStat icon={Icons.strength} value={p.strength}/>
</div>

const CivHeader = (p: CivProps) => <div style={{
  display: "flex",
  gap: 6,
  alignItems: "center",
}}>
  <div style={{
    fontSize: FontSizes.normal,
    height: 20,
    width: 20,
  }}>
    <ActionButton {...p.targetAction}/>
  </div>
  <div style={{
    fontSize: FontSizes.normalPlus,
  }}>
    {p.title}
  </div>
</div>

const CivView = (p: CivProps) => <Box>
      <div style={{
      borderWidth: 2,
      borderColor: p.targetted ? Colors.selected : "transparent",
      borderStyle: "solid",
      borderRadius: 4,
      marginTop: 6,
      marginBottom: 6,
    }}>
      <div style={{
        padding: 6,
        display: "flex",
        flexDirection: "column",
        gap: 4,
  
      }}>
        <CivHeader {...p}/>
        <CivStats {...p}/>
      </div>
    </div>
  </Box>

export const CivilizationsView = (p: CivsProps) =>
  <div>
    {p.civs.map((c, idx) => <CivView key={idx} {...c}/>)} 
  </div>


