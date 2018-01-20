import {
  Dispatcher
} from './Dispatcher'

import {
  CoreException
} from './CoreException'

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
    if (dispatcher instanceof Dispatcher) {
      this._dispatcher = dispatcher
    } else {
      throw new CoreException('Action:setDispatcher "dispatcher" is not instanceof Dispatcher')
    }
  }

  newAction(type, payload) {}

  dispatch(payload) {
    this._dispatcher.dispatch(payload)
  }
}

export {
  Action
}
