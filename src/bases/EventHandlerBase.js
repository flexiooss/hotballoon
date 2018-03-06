'use strict'

import {
  isFunction,
  isBoolean,
  assert,
  Sequence
} from 'flexio-jshelpers'

class EventHandlerBase {
  constructor() {
    this._listeners = new Map()
    this._pendingPayload = new Map()
    this._isHandled = new Set()
    this._isPending = new Set()
    this._sequenceId = new Sequence(this._ID)

    this._lastID = 0

    var _isDispatching = false
    Object.defineProperty(this, '_isDispatching', {
      enumerable: false,
      configurable: false,
      get: () => _isDispatching,
      set: (newIsDispatching) => {
        assert(isBoolean(newIsDispatching),
          'hotballoonView:Dispatcher: `newIsDispatching` argument assert be a Boolean'
        )
        _isDispatching = newIsDispatching
      }
    })
  }

  /**
     *
     * @param {String} type of Listener
     * @param {Object} payload
     */
  dispatch(type, payload) {
    this._beforeDispatching(type, payload)
    if (this._listeners.has(type)) {
      try {
        for (let id in this._listeners.get(type)) {
          if (this._isPending.has(id)) {
            continue
          }
          this._invokeCallback(type, id)
        }
      } finally {
        this._stopDispatching()
      }
    }
  }

  /**
     *
     * @private
     * @param {String} type of Listener
     * @param {String} id : token of listener
     */
  _invokeCallback(type, id) {
    this._isPending.add(id)
    this._listeners.get(type)[id].callback(this._pendingPayload.get(type), type)
    this._isHandled.add(id)
  }

  /**
     *
     * @param {String} type of Listener
     * @param {Function} callback
     * @returns {String} token
     */
  addEventListener(type, callback) {
    assert(!!type,
      'hotballoon:EventHandler:addEventListener: ̀`type` argument assert not be empty'
    )
    assert(isFunction(callback),
      'hotballoon:EventHandler:addEventListener: ̀`callback` argument assert be Callable'
    )

    if (!(this._listeners.has(type))) {
      this._listeners.set(type, {})
    }
    let id = this._sequenceId.getNewId().toString()

    this._listeners.get(type)[id] = {
      callback: callback
    }

    return id
  }

  /**
     *
     * @param {String} type of Listener
     * @param {String} id : token
     */
  removeEventListener(type, id) {
    if (this._listeners.has(type)) {
      assert(id in this._listeners.get(type),
        'hotballoon:EventHandlerBase:removeEventListener: ̀`id` argument not in _listeners : `%s`',
        type
      )
      delete this._listeners.get(type)[id]
    }
  }

  /**
     *
     * @param {String} type of Listener
     * @param {String} id : token
     * @returns {boolean}
     */
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
