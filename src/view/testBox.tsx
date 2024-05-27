import React from 'react';
import {Box} from './box'
import {ActionProps, ActionButton} from './action'

export type TestBoxProps = {
    counter: number
    decreaseCounter: ActionProps
    increaseCounter: ActionProps
}

export const TestBox = (p: TestBoxProps) =>
<Box>
  Counter: {p.counter}
  <ActionButton {...p.decreaseCounter}/>
  <ActionButton {...p.increaseCounter}/>
</Box>
