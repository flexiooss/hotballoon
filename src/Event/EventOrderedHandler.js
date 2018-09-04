'use strict'
import {assert, sortMap} from 'flexio-jshelpers'
import {EventHandlerBase} from './EventHandlerBase'
import {EventListenerOrderedParam} from './EventListenerOrderedParam'

/**
 * @class
 * @extends EventHandlerBase
 */
export class EventOrderedHandler extends EventHandlerBase {
  /**
   *
   * @param {EventListenerOrderedParam} eventListenerOrderedParam
   * @return {String} token
   * @throws AssertionError
   */
  on(eventListenerOrderedParam) {
    assert(eventListenerOrderedParam instanceof EventListenerOrderedParam,
      'hotballoon:EventHandler:on: ̀`eventListenerOrderedParam` argument assert be an instance of EventListenerOrderedParam'
    )

    this._mayInitListeners(eventListenerOrderedParam.event)

    const id = this.nextID()

    this._listeners.get(eventListenerOrderedParam.event).set(id, {
      scope: eventListenerOrderedParam.scope,
      callback: eventListenerOrderedParam.callback,
      priority: eventListenerOrderedParam.priority
    })

    this._listeners.set(eventListenerOrderedParam.event,
      sortMap(
        this._listeners.get(eventListenerOrderedParam.event),
        (a, b) => {
          return a.value.priority - b.value.priority
        }
      )
    )

    return id
  }

  /**
   * @private
   * @param {String} event
   * @param {String} token
   */
  _invokeCallback(event, token) {
    this._isPending.add(token)
    try {
      const listener = this._listeners.get(event).get(token)
      listener.callback.call(
        listener.scope,
        this._pendingPayload.get(event),
        event
      )
    } finally {
      this._isHandled.add(token)
    }
  }
}
