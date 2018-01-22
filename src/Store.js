import {
  EventHandler
} from './EventHandler'
import {
  StoreState
} from './StoreState'
import {
  shouldIs
} from './shouldIs'
import {
  staticClassName
} from './helpers'

class Store {
  constructor() {
    var eventHandler = Object.seal(new EventHandler())
    Object.defineProperty(this, '_EventHandler', {
      enumerable: false,
      configurable: false,
      value: eventHandler
    })

    var storeState = new StoreState()

    Object.defineProperty(this, '_state', {
      enumerable: false,
      configurable: false,
      get: () => storeState,
      set: (newStoreState) => {
        shouldIs(newStoreState instanceof StoreState,
          'hotballoon:Store:update: _state property should be an instance of hotballoon/StoreState ')
        storeState = newStoreState
        this._updated()
      }
    })

    this._dispatch('INIT')
  }

  static eventType() {
    const name = staticClassName(this).toUpperCase()
    return {
      INIT: name + ':INIT',
      CHANGED: name + ':CHANGED'
    }
  }

  state(key) {
    return this._state.get(key)
  }

  subscribe(type, callback, scope) {
    this._EventHandler.addEventListener.apply(this._EventHandler, arguments)
  }

  update(state) {
    this._state = this._state.update(this._fillState(state))
  }

  _updated() {
    this._dispatch('CHANGED')
  }

  _dispatch(eventType) {
    if (eventType in this.constructor.eventType()) {
      this._EventHandler.dispatch(this.constructor.eventType()[eventType], this.state())
    }
  }

  _fillState(state) {
    return state
  }
}

export {
  Store
}
