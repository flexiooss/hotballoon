// https://github.com/facebook/emitter/blob/master/src/BaseEventEmitter.js

import {
  shouldIs
} from './shouldIs'
import {
  isFunction,
  isObject
} from './helpers'

class EventHandler {
  constructor() {
    this._listeners = {}
    Object.seal(this)
    Object.freeze(this)
  }

  dispatch(type, payload) {
    const event = {
      type: type,
      payload: payload
    }

    var args = []
    var numOfArgs = arguments.length
    for (var i = 0; i < numOfArgs; i++) {
      args.push(arguments[i])
    };

    args = args.length > 2 ? args.splice(2, args.length - 1) : []
    args = [event].concat(args)

    if (type in this._listeners) {
      var listeners = this._listeners[type].slice()
      let countOfCallbacks = listeners.length
      for (let i = 0; i < countOfCallbacks; i++) {
        var listener = listeners[i]
        if (listener && listener.callback) {
          var concatArgs = args.concat(listener.args)
          listener.callback.apply(listener.scope, concatArgs)
        }
      }
    }
  }

  addEventListener(type, callback, scope, ...args) {
    shouldIs(!!type,
      'hotballoon:EventHandler:addEventListener: ̀`type` argument should not be empty'
    )
    shouldIs(isFunction(callback),
      'hotballoon:EventHandler:addEventListener: ̀`callback` argument should be callable'
    )
    shouldIs(isObject(scope),
      'hotballoon:EventHandler:addEventListener: ̀`scope` argument should be a scope'
    )

    if (!(type in this._listeners)) {
      this._listeners[type] = []
    }

    this._listeners[type].push({
      scope: scope,
      callback: callback,
      args: args
    })
  }

  removeEventListener(type, callback, scope) {
    if (type in this._listeners) {
      let countOfCallbacks = this._listeners[type].length
      var newArrayOfCallbacks = []
      for (let i = 0; i < countOfCallbacks; i++) {
        let listener = this._listeners[type][i]
        if (listener.scope !== scope && listener.callback !== callback) {
          newArrayOfCallbacks.push(listener)
        }
      }
      this._listeners[type] = newArrayOfCallbacks
    }
  }

  hasEventListener(type, callback, scope) {
    if (type in this._listeners) {
      var countOfCallbacks = this._listeners[type].length
      if (callback === undefined && scope === undefined) {
        return countOfCallbacks > 0
      }
      for (let i = 0; i < countOfCallbacks; i++) {
        let listener = this._listeners[type][i]
        if ((scope ? listener.scope === scope : true) && (listener.callback === callback)) {
          return true
        }
      }
    }
    return false
  }
}

export {
  EventHandler
}
