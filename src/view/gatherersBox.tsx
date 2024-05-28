import React from 'react';
import { Box } from './box'
import { GameModel, PopTypes } from '../model/gameModel'

export type GatherersBoxProps = {
  gatherersCount: number
}

export function gatherersBoxProps(model: GameModel): GatherersBoxProps {
  return {
    gatherersCount: model.population.pop(PopTypes.Gatherer).count
  }
}

export const GatherersBox = (p: GatherersBoxProps) =>
  <Box>
    Gatherers: {p.gatherersCount}
  </Box>


