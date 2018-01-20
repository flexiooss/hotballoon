// https://github.com/facebook/emitter/blob/master/src/BaseEventEmitter.js

class EventHandler {
  constructor() {
    this._listeners = {}
  }

  dispatch(type, target) {
    const event = {
      type: type,
      target: target
    }
    var args = []
    var numOfArgs = arguments.length
    for (var i = 0; i < numOfArgs; i++) {
      args.push(arguments[i])
    };
    args = args.length > 2 ? args.splice(2, args.length - 1) : []
    args = [event].concat(args)

    if (type in this._listeners) {
      var listeners = this.listeners[type].slice()
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

  addEventListener(type, callback, scope) {
    var args = []
    var numOfArgs = arguments.length
    for (var i = 0; i < numOfArgs; i++) {
      args.push(arguments[i])
    }
    args = args.length > 3 ? args.splice(3, args.length - 1) : []

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
    if (type in this.listeners) {
      let countOfCallbacks = this.listeners[type].length
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
