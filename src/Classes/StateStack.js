/**
 * Copyright Chamber Designs 2022 - All Rights Reserved
 */

export class StateStack {
  stack = [];
  constructor(stack) {
    this.stack = stack ? stack : [];
  }
  push(state) {
    this.stack.push(state);
  }
  pop() {
    return this.stack.pop();
  }
  getClone() {
    return new StateStack(this.stack);
  }
}
