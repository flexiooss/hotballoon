'use strict'
import {assert, sortObject} from 'flexio-jshelpers'
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

    if (!(this._listeners.has(eventListenerOrderedParam.event))) {
      this._listeners.set(eventListenerOrderedParam.event, {})
    }

    const id = this._sequenceId.nextID().toString()

    this._listeners.get(eventListenerOrderedParam.event)[id] = {
      scope: eventListenerOrderedParam.scope,
      callback: eventListenerOrderedParam.callback,
      priority: eventListenerOrderedParam.priority
    }

    this._listeners.set(eventListenerOrderedParam.event,
      sortObject(this._listeners.get(eventListenerOrderedParam.event),
        (a, b) => {
          return a.priority - b.priority
        }))

    return id
  }

  /**
   * @private
   * @param {String} type
   * @param {String} id
   */
  _invokeCallback(type, id) {
    this._isPending.add(id)
    let listener = this._listeners.get(type)[id]
    listener.callback.call(listener.scope, this._pendingPayload.get(type), type)
    this._isHandled.add(id)
  }
}
