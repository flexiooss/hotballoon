'use strict'
import {
  assert,
  sortObject
} from 'flexio-jshelpers'
import {
  EventHandlerBase
} from './EventHandlerBase'
import {EventListenerParam} from './EventListenerParam'

/**
 * @class
 * @extends EventHandlerBase
 */
class EventOrderedHandler extends EventHandlerBase {
  /**
   *
   * @param {EventListenerParam} eventListenerParam
   * @return {String} token
   */
  on(eventListenerParam) {
    assert(eventListenerParam instanceof EventListenerParam,
      'hotballoon:EventHandler:on: ̀`eventListenerFactory` argument assert be an instance of EventListenerFactory'
    )

    if (!(this._listeners.has(eventListenerParam.event))) {
      this._listeners.set(eventListenerParam.event, {})
    }

    let id = this._sequenceId.nextID().toString()

    this._listeners.get(eventListenerParam.event)[id] = {
      scope: eventListenerParam.scope,
      callback: eventListenerParam.callback,
      priority: eventListenerParam.priority
    }

    this._listeners.set(eventListenerParam.event,
      sortObject(this._listeners.get(eventListenerParam.event),
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

export {
  EventOrderedHandler
}
