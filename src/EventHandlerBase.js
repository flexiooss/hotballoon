'use strict'

import {
  shouldIs
} from './shouldIs'
import {
  isFunction,
  isBoolean

} from './helpers'

class EventHandlerBase {
  constructor() {
    this._listeners = {}
    this._pendingPayload = {}
    this._isHandled = {}
    this._isPending = {}
    this._lastID = 0

    var _isDispatching = false
    Object.defineProperty(this, '_isDispatching', {
      enumerable: false,
      configurable: false,
      get: () => _isDispatching,
      set: (newIsDispatching) => {
        shouldIs(isBoolean(newIsDispatching),
          'hotballoonView:Dispatcher: `newIsDispatching` argument should be a Boolean'
        )
        _isDispatching = newIsDispatching
      }
    })
  }

  _getNextId() {
    this._lastID++
    return this._lastID
  }

  dispatch(type, payload) {
    this._beforeDispatching(type, payload)

    if (type in this._listeners) {
      try {
        for (let id in this._listeners[type]) {
          if (this._isPending[id]) {
            continue
          }
          this._invokeCallback(type, id)
        }
      } finally {
        this._stopDispatching()
      }
    }
  }

  _invokeCallback(type, id) {
    this._isPending[id] = true
    this._listeners[type][id].callback(this._pendingPayload[type])
    this._isHandled[id] = true
  }

  addEventListener(type, callback) {
    shouldIs(!!type,
      'hotballoon:EventHandler:addEventListener: ̀`type` argument should not be empty'
    )
    shouldIs(isFunction(callback),
      'hotballoon:EventHandler:addEventListener: ̀`callback` argument should be Callable'
    )

    if (!(type in this._listeners)) {
      this._listeners[type] = {}
    }
    let id = this._getNextId()

    this._listeners[type][id] = {
      callback: callback
    }

    return id
  }

  removeEventListener(type, id) {
    if (type in this._listeners) {
      shouldIs(id in this._listeners[type],
        'hotballoon:EventHandlerBase:removeEventListener: ̀`id` argument not in _listeners : `%s`',
        type
      )
      delete this._listeners[type][id]
    }
  }

  hasEventListener(type, id) {
    return (type in this._listeners) && (id in this._listeners[type])
  }

  _beforeDispatching(type, payload) {
    for (var id in this._listeners) {
      this._isPending[id] = false
      this._isHandled[id] = false
    }
    this._pendingPayload[type] = payload
    this._isDispatching = true
  }

  _stopDispatching(type) {
    delete this._pendingPayload[type]
    this._isDispatching = false
  }

  isDispatching() {
    return this._isDispatching
  }
}

export {
  EventHandlerBase
}
