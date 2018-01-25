import {
  EventOrderedHandler
} from './EventOrderedHandler'

import {
  filterObject
} from './helpers'
import {
  merge,
  cloneDeep
} from 'lodash'
import {
  Model
} from './Model'

class StoreBase {
  constructor() {
    this._model = new Model()
    var eventHandler = Object.seal(new EventOrderedHandler())
    Object.defineProperty(this, '_EventHandler', {
      enumerable: false,
      configurable: false,
      value: eventHandler
    })
  }

  static eventTypes() {
    return {}
  }

  addSchemaProp(schemaProperty) {
    this._model.addSchemaProp(schemaProperty)
  }

  state(key) {
    var state = this._state.get(key)
    return (state) || {}
  }

  subscribe(type, callback, scope, priority) {
    return this._EventHandler.addEventListener(type, callback, scope, priority)
  }

  update(state) {
    this._state = this._state.update(
      merge(
        cloneDeep(this.state()),
        this._fillState(state)
      )
    )
  }

  save(state) {
    this._state = this._state.update(this._fillState(state))
  }

  _updated() {}

  _dispatch(eventType, payload) {
    if (eventType in this.constructor.eventTypes()) {
      this._EventHandler.dispatch(this.constructor.eventTypes()[eventType], payload || this.state())
    }
  }

  _fillState(state) {
    return this._inModel(state)
  }

  _inModel(object) {
    filterObject(object, (value, key, scope) => {
      return this._model.get().has(key)
    })
    return object
  }
}

export {
  StoreBase
}
