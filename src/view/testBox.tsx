import React from 'react';
import {Box} from './box'
import {ActionProps, ActionButton} from './action'
import {TestModel} from '../model/testModel'

export type TestBoxProps = {
    counter: number
    decreaseCounter: ActionProps
    increaseCounter: ActionProps
}

export function testBoxProps(model: TestModel): TestBoxProps {
  return {
    counter: model.counter,

    decreaseCounter: {
      title: "Dec",
      action: () => model.decreaseCounter(),
      disabled: model.checkIncreaseDisabled()
    },
    increaseCounter: {
      title: "Inc",
      action: () => model.increaseCounter(),
    },
  }
}

export const TestBox = (p: TestBoxProps) =>
<Box>
  Counter: {p.counter}
  <ActionButton {...p.decreaseCounter}/>
  <ActionButton {...p.increaseCounter}/>
</Box>


