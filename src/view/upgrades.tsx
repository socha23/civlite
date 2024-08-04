import React from 'react';
import { Box } from './box'
import { GameModel } from '../model/gameModel'
import { ActionProps, ActionRow3, propsForAction } from './action';
import { UpgradeLabels } from './labels';
import { ActionState } from '../model/action';
import { UpgradeType, } from '../model/upgrade';
import { UpgradeNode } from '../model/upgradeModel';

export type UpgradeSectionProps = {
  availableResearchActions: ActionProps[]
}

export function upgradeSectionProps(model: GameModel, types: UpgradeType[]): UpgradeSectionProps {

  const upgrades: UpgradeNode[] = []
  types.forEach(t => {
    upgrades.push(...model.upgrades.uncompletedAvailableUpgrades(t))
  })


  return {
    availableResearchActions: upgrades.map(node => propsForAction(
      model, node.action, {
        title: UpgradeLabels[node.type].TitlePrefix + node.title,
        description: <div style={{display: "flex", flexDirection: "column", gap: 4}}>
          <div>{node.description}</div>
          <div style={{fontStyle: "italic"}}>{node.flavorText}</div>
        </div>,
        buttonLabel: node.definition.buttonTitle || UpgradeLabels[node.type].ButtonTitle
      }
    ))
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
      p.availableResearchActions.map(a => <ActionRow3 key={a.id} {...a} displayCost={a.state !== ActionState.InProgress }/>)
    }
    </div>
  </Box>


