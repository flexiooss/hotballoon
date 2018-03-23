'use strict'

import {
  assert,
  isFunction,
  isObject,
  isNumber,
  sortObject
} from 'flexio-jshelpers'
import {
  EventHandlerBase
} from './bases/EventHandlerBase'

/**
 * @class
 * @extends EventHandlerBase
 */
class EventOrderedHandler extends EventHandlerBase {
  /**
     *
     * @param {String} type
     * @param {function} callback
     * @param {Object} scope
     * @param {Integer} priority
     * @requires {String} token
     */
  addEventListener(type, callback, scope, priority) {
    assert(!!type,
      'hotballoon:EventHandler:addEventListener: ̀`type` argument assert not be empty'
    )
    assert(isFunction(callback),
      'hotballoon:EventHandler:addEventListener: ̀`callback` argument assert be Callable'
    )
    assert(isObject(scope),
      'hotballoon:EventHandler:addEventListener: ̀`scope` argument assert be a scope'
    )
    assert(isNumber(priority),
      'hotballoon:EventHandler:addEventListener: ̀`priority` argument assert be a Number'
    )

    if (!(this._listeners.has(type))) {
      this._listeners.set(type, {})
    }

    let id = this._sequenceId.getNewId().toString()

    this._listeners.get(type)[id] = {
      scope: scope,
      callback: callback,
      priority: priority
    }

    this._listeners.set(type,
      sortObject(this._listeners.get(type),
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
