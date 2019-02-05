'use strict'
import {isBoolean, assert, Sequence} from 'flexio-jshelpers'
import {EventListenerParam} from './EventListenerParam'

const _isDispatching_ = Symbol('_isDispatching_')
const _sequenceId_ = Symbol('_sequenceId_')

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
    this[_sequenceId_] = new Sequence(this.ID)

    /**
     * @property {boolean}
     * @name EventHandlerBase#Symbol(_isDispatching_)
     * @private
     */
    var _isDispatching = false
    Object.defineProperty(this, _isDispatching_, {
      enumerable: false,
      configurable: false,
      get: () => _isDispatching,
      set: (v) => {
        assert(isBoolean(v),
          'hotballoonView:dispatcher: `newIsDispatching` argument assert be a Boolean'
        )
        _isDispatching = v
      }
    })
  }

  /**
   *
   * @param {String} event
   * @param {Object} payload
   */
  dispatch(event, payload) {
    if (this._listeners.has(event)) {
      this._beforeDispatch(event, payload)
      try {
        this._listeners.get(event).forEach((v, k) => {
          if (!this._isPending.has(k)) {
            this._invokeCallback(event, k)
          }
        })
      } finally {
        this._stopDispatching(event)
      }
    }
  }

  /**
   *
   * @param {string} event
   * @protected
   */
  _mayInitListeners(event) {
    if (!(this._listeners.has(event))) {
      this._listeners.set(event, new Map())
    }
  }

  /**
   *
   * @private
   * @param {String} event of Listener
   * @param {String} token : token of listener
   */
  _invokeCallback(event, token) {
    this._isPending.add(token)
    try {
      this._listeners.get(event)
        .get(token)
        .callback(this._pendingPayload.get(event), event)
    } finally {
      this._isHandled.add(token)
    }
  }

  /**
   *
   * @return {string}
   */
  nextID() {
    return this[_sequenceId_].nextID()
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

    this._mayInitListeners(eventListenerParam.event)
    const id = this.nextID()

    this._listeners.get(eventListenerParam.event)
      .set(id, {
        callback: eventListenerParam.callback
      })

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
      assert(this._listeners.get(event).has(token),
        'hotballoon:EventHandlerBase:removeEventListener: ̀`id` argument not in _listeners : `%s`',
        event
      )
      this._listeners.get(event).delete(token)
    }
  }

  /**
   *
   * @param {String} event of Listener
   * @param {String} token : token
   * @returns {boolean}
   */
  hasEventListener(event, token) {
    return (this._listeners.has(event)) && (this._listeners.get(event).has(token))
  }

  /**
   *
   * @param {String} event of Listener
   * @param {Object} payload
   * @private
   */
  _beforeDispatch(event, payload) {
    this._listeners.get(event).forEach((v, k) => {
      this._isHandled.delete(k)
    })
    this._pendingPayload.set(event, payload)
    this[_isDispatching_] = true
  }

  /**
   *
   * @param {string} event
   * @protected
   */
  _stopDispatching(event) {
    this._listeners.get(event).forEach((v, k) => {
      this._isPending.delete(k)
    })
    this._pendingPayload.delete(event)
    this[_isDispatching_] = false
  }

  /**
   *
   * @return {boolean}
   */
  isDispatching() {
    return this[_isDispatching_]
  }
}
