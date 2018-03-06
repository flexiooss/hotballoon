'use strict'
import {
  Dispatcher
} from './Dispatcher'

import {
  assert
} from 'flexio-jshelpers'

const TYPES = {}

class Action {
  constructor(dispatcher, componentId) {
    assert(dispatcher instanceof Dispatcher,
      'hotballoon:Action:setDispatcher "dispatcher" argument assert be an instance of Dispatcher'
    )
    assert(!!componentId,
      'hotballoon:Action:_setComponentId "componentId" argument assert not be empty'
    )
    Object.defineProperties(this, {
      _dispatcher: {
        configurable: false,
        enumerable: false,
        value: dispatcher
      },
      _componentId: {
        configurable: false,
        enumerable: false,
        writable: false,
        value: componentId
      }

    })

    this._types = TYPES
  }

  type(key) {
    assert(key in this._types,
      'hotballoon:Action:' + this.constructor.name + ':type: `key` argument not defined in `_types` property'
    )
    return this._componentId + '_' + this._types[key]
  }

  newAction(type, payload) {}

  dispatch(type, payload) {
    this._dispatcher.dispatch(type, payload)
  }
}

export {
  Action
}
