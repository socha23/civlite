import React from 'react';
import { Box } from './box'
import { GameModel } from '../model/gameModel'
import { ActionProps, ActionRow3, propsForAction } from './action';
import { UpgradeLabels } from './labels';
import { ActionState } from '../model/action';
import { UpgradeType, } from '../model/upgrade';

export type UpgradeProps = {
  action: ActionProps
  completed: boolean
}
export type UpgradeSectionProps = {
  upgrades: UpgradeProps[]
}

export function upgradeSectionProps(model: GameModel, types: UpgradeType[]): UpgradeSectionProps {

  const upgrades = model.upgrades.visibleUpgrades(types)


  return {
    upgrades: upgrades.map(node => {
      const description = <div style={{display: "flex", flexDirection: "column", gap: 4}}>
        <div>{node.description}</div>
        <div style={{fontStyle: "italic"}}>{node.flavorText}</div>
      </div>
      const title = UpgradeLabels[node.type].TitlePrefix + node.title
      const buttonLabel = node.definition.buttonTitle || UpgradeLabels[node.type].ButtonTitle
      
      return {
        action: propsForAction(model, node.action, {description, title, buttonLabel}),
        completed: node.completed,
      }}),
  }
}

export const UpgradeSection = (p: UpgradeSectionProps) =>
  <Box>
    <div 
    className='dottedDividersParent'
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 4,
      marginTop: 4,
      marginBottom: 4,
    }}> {
      p.upgrades.map(a => <ActionRow3 
        key={a.action.id} 
        {...a.action} 
        displayCost={a.action.state !== ActionState.InProgress }
        />)
    }
    </div>
  </Box>


