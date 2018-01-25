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
    this._listeners = new Map()
    this._pendingPayload = new Map()
    this._isHandled = new Set()
    this._isPending = new Set()
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
    console.group('dispatch')
    console.log('type')
    console.log(type)

    this._beforeDispatching(type, payload)

    console.log('_listeners')
    console.log(this._listeners)
    console.log(this._listeners.has(type))
    if (this._listeners.has(type)) {
      console.log('ici')
      try {
        for (let id in this._listeners.get(type)) {
          if (this._isPending.has(id)) {
            continue
          }
          console.log('_invokeCallback')
          this._invokeCallback(type, id)
        }
      } finally {
        this._stopDispatching()
      }
    }
    console.groupEnd()
  }

  _invokeCallback(type, id) {
    console.log('type')
    console.log(type)
    this._isPending.add(id)
    this._isHandled.add(id)
    this._listeners.get(type)[id].callback(this._pendingPayload.get(type), type)
  }

  addEventListener(type, callback) {
    shouldIs(!!type,
      'hotballoon:EventHandler:addEventListener: ̀`type` argument should not be empty'
    )
    shouldIs(isFunction(callback),
      'hotballoon:EventHandler:addEventListener: ̀`callback` argument should be Callable'
    )

    if (!(this._listeners.has(type))) {
      this._listeners.set(type, {})
    }
    let id = this._getNextId()

    this._listeners.get(type)[id] = {
      callback: callback
    }

    return id
  }

  removeEventListener(type, id) {
    if (this._listeners.has(type)) {
      shouldIs(id in this._listenersget(type),
        'hotballoon:EventHandlerBase:removeEventListener: ̀`id` argument not in _listeners : `%s`',
        type
      )
      delete this._listeners.get(type)[id]
    }
  }

  hasEventListener(type, id) {
    return (this._listeners.has(type)) && (id in this._listeners.get(type))
  }

  _beforeDispatching(type, payload) {
    for (let id in this._listeners.get(type)) {
      this._isPending.delete(id)
      this._isHandled.delete(id)
    }
    this._pendingPayload.set(type, payload)
    this._isDispatching = true
  }

  _stopDispatching(type) {
    this._pendingPayload.delete(type)
    this._isDispatching = false
  }

  isDispatching() {
    return this._isDispatching
  }
}

export {
  EventHandlerBase
}
