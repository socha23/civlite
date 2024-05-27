export class TestModel {
  counter: number = 0

  onTick(deltaS: number) {
    // noop
  }

  increaseCounter() {
    this.counter++
  }

  decreaseCounter() {
    this.counter--
  }

  checkIncreaseDisabled() {
    if (this.counter == 0) {
      return "Can't decrease to lower than 0"
    } else {
      return false
    }
  }

}
