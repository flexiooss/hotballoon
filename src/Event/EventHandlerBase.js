'use strict'
import {isBoolean, assert, Sequence} from 'flexio-jshelpers'
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
    this._sequenceId = new Sequence(this.ID)
    // /**
    //  *
    //  * @type {number}
    //  * @protected
    //  */
    // this._lastID = 0

    var _isDispatching = false
    Object.defineProperty(this, '_isDispatching', {
      enumerable: false,
      configurable: false,
      get: () => _isDispatching,
      set: (v) => {
        assert(isBoolean(v),
          'hotballoonView:Dispatcher: `newIsDispatching` argument assert be a Boolean'
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
      this._beforeDispatching(event, payload)
      try {
        this._listeners.get(event).forEach((v, k) => {
          if (!this._isPending.has(k)) {
            this._invokeCallback(event, k)
          }
        })
      } catch (e) {
        console.log(e)
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
    } catch (e) {
      console.log(e)
    } finally {
      this._isHandled.add(token)
    }
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
    const id = this._sequenceId.nextID().toString()

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

  _beforeDispatching(event, payload) {
    this._listeners.get(event).forEach((v, k) => {
      this._isPending.delete(k)
      this._isHandled.delete(k)
    })
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
