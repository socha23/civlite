import React from 'react';
import { Box } from './box'
import { GameModel } from '../model/gameModel'
import { PopType } from '../model/pops';
import { Colors, FontSizes, Icons, Labels } from './icons';
import { ActionProps, propsForAction, ActionButton } from './action';
import { formatNumber } from '../model/utils';
import { WarProps, WarView, warProps } from './war';



type CivProps = {
  title: string,
  population: number,
  strength: number,
  attackActions: ActionProps[]
  wars: WarProps[]
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
      attackActions: c.availableWarGoals().map(g => propsForAction(model,
        model.wars.startWarAction(g, model.military.attackingArmy(), c), {
          title: Labels[g]
        }
      )),
      wars: model.wars.ongoingWarsAgainst(c).map(w => warProps(model, w))
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
  paddingBottom: 4,
  alignItems: "center",
}}>
  <CivStat icon={Icons.population} value={p.population}/>
  <CivStat icon={Icons.strength} value={p.strength}/>
</div>

const CivHeader = (p: CivProps) => <div style={{
  display: "flex",
  paddingBottom: 4,
  gap: 6,
  alignItems: "center",
}}>
  <div style={{
    fontSize: FontSizes.normalPlus,
  }}>
    {p.title}
  </div>
</div>

const CivAttackActions = (p: CivProps) => <div style={{
  display: "flex",
  gap: 4,
  alignItems: "center"
}}>
  {p.attackActions.map((a, idx) => <ActionButton key={idx} {...a}/>)}
</div>

const CivView = (p: CivProps) => <Box>

    <div className="dottedDividersParent" style={{
      display: "flex",
      flexDirection: "column",
      gap: 4,
      marginTop: 4,
      marginBottom: 16,

    }}>
      <CivHeader {...p}/>
      <CivStats {...p}/>
      {p.wars.map((w, idx) => <WarView key={idx} {...w}/>)}
      <CivAttackActions {...p}/>
    </div>
  </Box>

export const CivilizationsView = (p: CivsProps) =>
  <div>
    {p.civs.map((c, idx) => <CivView key={idx} {...c}/>)} 
  </div>


