import React from 'react';
import { Box } from './box'
import { GameModel } from '../model/gameModel'
import { ActionProps, ActionRow3, propsForAction } from './action';
import { ResearchLabels } from './labels';

export type ResearchSectionProps = {
  availableResearchActions: ActionProps[]
}

export function researchSectionProps(model: GameModel): ResearchSectionProps {

  return {
    availableResearchActions: model.research.availableResearch.map(node => propsForAction(
      model, node.action, {
        title: node.title,
        description: node.description,
        buttonLabel: node.definition.buttonTitle || ResearchLabels.ButtonTitle
      }
    ))
  }
}

export const ResearchSection = (p: ResearchSectionProps) =>
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
      p.availableResearchActions.map(a => <ActionRow3 key={a.id} {...a}/>)
    }
    </div>
  </Box>


