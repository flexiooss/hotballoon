import {
  Dispatcher
} from './Dispatcher'

import {
  should
} from './helpers'

class Action {
  constructor(dispatcher, componentId) {
    this._setDispatcher(dispatcher)
    this._setComponentId(componentId)
  }
  _setDispatcher(dispatcher) {
    should(dispatcher instanceof Dispatcher,
      'hotballoon:Action:setDispatcher "dispatcher" argument should be an instance of Dispatcher'
    )
    this._dispatcher = dispatcher
  }
  _setComponentId(componentId) {
    should(!!componentId,
      'hotballoon:Action:_setComponentId "componentId" argument should not be empty'
    )
    this._componentId = componentId
  }

  types() {
    return {}
  }

  type(key) {
    return this._componentId + '_' + this.types()[key]
  }

  newAction(type, payload) {}

  dispatch(type, payload) {
    this._dispatcher.dispatch(type, payload)
  }
}

export {
  Action
}
