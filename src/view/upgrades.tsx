import React from 'react';
import { Box } from './box'
import { GameModel } from '../model/gameModel'
import { ActionProps, ActionRow3, propsForAction } from './action';
import { ResearchLabels } from './labels';
import { ActionState } from '../model/action';
import { UpgradeType } from '../model/upgrade';

export type UpgradeSectionProps = {
  availableResearchActions: ActionProps[]
}

export function upgradeSectionProps(model: GameModel, type: UpgradeType): UpgradeSectionProps {

  return {
    availableResearchActions: model.upgrades.uncompletedAvailableUpgrades(type).map(node => propsForAction(
      model, node.action, {
        title: node.title,
        description: <div style={{display: "flex", flexDirection: "column", gap: 4}}>
          <div>{node.description}</div>
          <div style={{fontStyle: "italic"}}>{node.flavorText}</div>
        </div>,
        buttonLabel: node.definition.buttonTitle || ResearchLabels.ButtonTitle
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


