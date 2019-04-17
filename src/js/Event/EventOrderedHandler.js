'use strict'
import {assertType, sortMap, EventHandlerBase, StringArray} from 'flexio-jshelpers'
import {EventListenerOrderedParam} from './EventListenerOrderedParam'

/**
 * @class
 * @extends {EventHandlerBase}
 */
export class EventOrderedHandler extends EventHandlerBase {
  /**
   *
   * @param {EventListenerOrderedParam} eventListenerOrderedParam
   * @return {(String|StringArray)} token
   * @throws AssertionError
   */
  on(eventListenerOrderedParam) {
    assertType(eventListenerOrderedParam instanceof EventListenerOrderedParam,
      'hotballoon:EventHandler:on: ̀`eventListenerOrderedParam` argument assert be an instance of EventListenerOrderedParam'
    )

    const ids = new StringArray()
    for (const event of eventListenerOrderedParam.events) {
      this._ensureHaveListenersMap(event)

      const id = this.nextID()

      this._listeners.get(event).set(id, {
        callback: eventListenerOrderedParam.callback,
        priority: eventListenerOrderedParam.priority
      })

      this._listeners.set(event,
        sortMap(
          this._listeners.get(event),
          (a, b) => {
            return a.value.priority - b.value.priority
          }
        )
      )
      ids.push(id)
    }

    return ids.length > 1 ? ids : ids.first()
  }

  /**
   * @private
   * @param {(String|Symbol)} event
   * @param {String} token
   */
  _invokeCallback(event, token) {
    this._isPending.add(token)
    try {
      const listener = this._listeners.get(event).get(token)
      listener.callback(
        this._pendingPayload.get(event),
        event
      )
    } finally {
      this._isHandled.add(token)
    }
  }
}
