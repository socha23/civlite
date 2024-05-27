import {TestState} from '../state/testState'
import {TestBoxProps} from '../view/testBox'

export class TestModel {
  state: TestState

  constructor(state: TestState) {
    this.state = state
  }

  updateState(deltaS: number) {
    // noop
  }

  increaseCounter() {
    this.state.counter++
  }

  decreaseCounter() {
    this.state.counter--
  }

  get viewProps(): TestBoxProps {
    return {
      counter: this.state.counter,

      decreaseCounter: {
        title: "Dec",
        action: () => this.decreaseCounter(),
        disabled: (this.state.counter <= 0) ? "Can't decrease to lower than 0" : false
      },
      increaseCounter: {
        title: "Inc",
        action: () => this.increaseCounter(),
      },
    }
  }
}
