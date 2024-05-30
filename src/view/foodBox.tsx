import React from 'react';
import { Box } from './box'
import { GameModel } from '../model/gameModel'

export type FoodBoxProps = {
  foodCount: number,
  foodSurplus: number,
}

export function foodBoxProps(model: GameModel): FoodBoxProps {
  return {
    foodCount: model.resources.food.count,
    foodSurplus: model.population.foodSurplus
  }
}

export const FoodBox = (p: FoodBoxProps) =>
  <Box>
    Food: {p.foodCount.toFixed(1)} ({p.foodSurplus.toFixed(1)} / s)
  </Box>


