import {
  ApplicationContext
} from './ApplicationContext'

class Component extends ApplicationContext {
  constructor(hotBallonApplication) {
    super(hotBallonApplication)
    this._dispatchToken = {}
  }
}
export {
  Component
}
