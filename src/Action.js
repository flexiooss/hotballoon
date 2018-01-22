import {
  Dispatcher
} from './Dispatcher'

import {
  shouldIs
} from './shouldIs'

class Action {
  constructor(dispatcher, ...props) {
    try {
      this.setDispatcher(dispatcher)
    } catch (e) {
      console.log(e.message, e.name)
    }
  }

  static types() {
    return {}
  }

  static getTypes() {
    return this.types()
  }
  static type(key) {
    return this.getTypes()[key]
  }

  setDispatcher(dispatcher) {
    shouldIs(dispatcher instanceof Dispatcher,
      'hotballoon:Action:setDispatcher "dispatcher" argument should be an instance of Dispatcher'
    )
    this._dispatcher = dispatcher
  }

  newAction(type, payload) {}

  dispatch(type, payload) {
    this._dispatcher.dispatch(type, payload)
  }
}

export {
  Action
}
