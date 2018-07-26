'use strict'
import {isBoolean, assert, Sequence, sortObject} from 'flexio-jshelpers'
import {EventListenerParam} from './EventListenerParam'

/**
 * @class
 * @abstract
 */
export class EventHandlerBase {
  constructor() {
    /**
     *
     * @type {Map<any, any>}
     * @protected
     */
    this._listeners = new Map()
    this._pendingPayload = new Map()
    /**
     *
     * @type {Set<string>}
     * @protected
     */
    this._isHandled = new Set()
    /**
     *
     * @type {Set<string>}
     * @protected
     */
    this._isPending = new Set()
    this._sequenceId = new Sequence(this._ID)
    /**
     *
     * @type {number}
     * @protected
     */
    // this._lastID = 0

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
   * @param {String} event
   * @param {Object} payload
   */
  dispatch(event, payload) {
    this._beforeDispatching(event, payload)
    if (this._listeners.has(event)) {
      try {
        for (let id in this._listeners.get(event)) {
          if (this._isPending.has(id)) {
            continue
          }
          this._invokeCallback(event, id)
        }
      } finally {
        this._stopDispatching(event)
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
   * @param {EventListenerParam} eventListenerParam
   * @returns {String} token
   */
  addEventListener(eventListenerParam) {
    assert(eventListenerParam instanceof EventListenerParam,
      'hotballoon:EventHandlerBase:addEventListener: ̀`eventListenerParam` argument assert be an instance of EventListenerParam'
    )

    if (!(this._listeners.has(eventListenerParam.event))) {
      this._listeners.set(eventListenerParam.event, {})
    }
    const id = this._sequenceId.nextID().toString()

    this._listeners.get(eventListenerParam.event)[id] = {
      callback: eventListenerParam.callback
    }

    return id
  }

  /**
   *
   * @param {String} event of Listener
   * @param {String} token : token
   * @throws AssertionError
   */
  removeEventListener(event, token) {
    if (this._listeners.has(event)) {
      assert(token in this._listeners.get(event),
        'hotballoon:EventHandlerBase:removeEventListener: ̀`id` argument not in _listeners : `%s`',
        event
      )
      delete this._listeners.get(event)[token]
    }
  }

  /**
   *
   * @param {String} event of Listener
   * @param {String} id : token
   * @returns {boolean}
   */
  hasEventListener(event, id) {
    return (this._listeners.has(event)) && (id in this._listeners.get(event))
  }

  _beforeDispatching(event, payload) {
    for (let id in this._listeners.get(event)) {
      this._isPending.delete(id)
      this._isHandled.delete(id)
    }
    this._pendingPayload.set(event, payload)
    this._isDispatching = true
  }

  /**
   *
   * @param {string} event
   * @protected
   */
  _stopDispatching(event) {
    this._pendingPayload.delete(event)
    this._isDispatching = false
  }

  /**
   *
   * @return {boolean}
   */
  isDispatching() {
    return this._isDispatching
  }
}
