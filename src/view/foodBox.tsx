import React from 'react';
import { Box } from './box'
import { GameModel } from '../model/gameModel'
import { ResourceType } from '../model/resources';

export type FoodBoxProps = {
  foodCount: number,
  foodSurplus: number,
}

export function foodBoxProps(model: GameModel): FoodBoxProps {
  return {
    foodCount: model.resources.food.count,
    foodSurplus: model.production(ResourceType.Food) -  model.consumption(ResourceType.Food)
  }
}

export const FoodBox = (p: FoodBoxProps) =>
  <Box>
    Food: {p.foodCount.toFixed(1)} ({p.foodSurplus.toFixed(1)} / s)
  </Box>


