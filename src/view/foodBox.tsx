import React from 'react';
import { Box } from './box'
import { GameModel } from '../model/gameModel'

export type FoodBoxProps = {
  foodCount: number
}

export function foodBoxProps(model: GameModel): FoodBoxProps {
  return {
    foodCount: model.resources.food.count
  }
}

export const FoodBox = (p: FoodBoxProps) =>
  <Box>
    Food: {p.foodCount}
  </Box>


