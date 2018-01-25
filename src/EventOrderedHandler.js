'use strict'

import {
  shouldIs
} from './shouldIs'
import {
  isFunction,
  isObject,
  isNumber,
  sortObject
} from './helpers'
import {
  EventHandlerBase
} from './EventHandlerBase'

class EventOrderedHandler extends EventHandlerBase {
  addEventListener(type, callback, scope, priority) {
    shouldIs(!!type,
      'hotballoon:EventHandler:addEventListener: ̀`type` argument should not be empty'
    )
    shouldIs(isFunction(callback),
      'hotballoon:EventHandler:addEventListener: ̀`callback` argument should be Callable'
    )
    shouldIs(isObject(scope),
      'hotballoon:EventHandler:addEventListener: ̀`scope` argument should be a scope'
    )
    shouldIs(isNumber(priority),
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
}

export {
  EventOrderedHandler
}
