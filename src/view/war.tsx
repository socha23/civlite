import React from 'react';
import { Box } from './box'
import { GameModel } from '../model/gameModel'
import { PopType } from '../model/pops';
import { FontSizes, Icons, Labels } from './icons';
import { ActionProps, propsForAction, ActionButton, ActionRow } from './action';
import { formatNumber } from '../model/utils';
import { WarType } from '../model/wars';
import { War } from '../model/warModel';

export type WarProps = {
  goal: WarType
  armyTitle: string
  againstTitle: string
  againstColor: string 
}

export function warProps(war: War): WarProps {
  return {
    goal: war.goal,
    armyTitle: war.army.title,
    againstTitle: war.against.title,
    againstColor: "#000"     
  }
}

export const OccupationDescriptionForArmy = (p: WarProps) => <div>
  
</div>


