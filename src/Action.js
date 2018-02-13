import {
  Dispatcher
} from './Dispatcher'

import {
  assert
} from 'flexio-jshelpers'

class Action {
  constructor(dispatcher, componentId) {
    this._setDispatcher(dispatcher)
    this._setComponentId(componentId)
  }
  _setDispatcher(dispatcher) {
    assert(dispatcher instanceof Dispatcher,
      'hotballoon:Action:setDispatcher "dispatcher" argument assert be an instance of Dispatcher'
    )
    this._dispatcher = dispatcher
  }
  _setComponentId(componentId) {
    assert(!!componentId,
      'hotballoon:Action:_setComponentId "componentId" argument assert not be empty'
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
