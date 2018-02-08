'use strict'

import {
  should,
  isFunction,
  isObject,
  isNumber,
  sortObject
} from 'flexio-jshelpers'
import {
  EventHandlerBase
} from './bases/EventHandlerBase'

class EventOrderedHandler extends EventHandlerBase {
  addEventListener(type, callback, scope, priority) {
    should(!!type,
      'hotballoon:EventHandler:addEventListener: ̀`type` argument should not be empty'
    )
    should(isFunction(callback),
      'hotballoon:EventHandler:addEventListener: ̀`callback` argument should be Callable'
    )
    should(isObject(scope),
      'hotballoon:EventHandler:addEventListener: ̀`scope` argument should be a scope'
    )
    should(isNumber(priority),
      'hotballoon:EventHandler:addEventListener: ̀`priority` argument should be a Number'
    )

    if (!(this._listeners.has(type))) {
      this._listeners.set(type, {})
    }
    let id = this._getNextId()

    this._listeners.get(type)[id] = {
      scope: scope,
      callback: callback,
      priority: priority
    }

    this._listeners.set(type, sortObject(this._listeners.get(type), (a, b) => {
      return a.priority - b.priority
    }))

    return id
  }

  _invokeCallback(type, id) {
    this._isPending.add(id)
    this._isHandled.add(id)
    let listener = this._listeners.get(type)[id]
    listener.callback.call(listener.scope, this._pendingPayload.get(type), type)
  }
}

export {
  EventOrderedHandler
}
