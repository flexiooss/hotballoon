import {
  EventOrderedHandler
} from '../EventOrderedHandler'

import {
  filterObject
} from '../helpers'
import {
  merge,
  cloneDeep
} from 'lodash'
import {
  Model
} from '../Model'
import {
  RequireIDMixin
} from '../mixins/RequireIDMixin'
class StoreBase extends RequireIDMixin(class {}) {
  constructor(id) {
    super()
    this.RequireIDMixinInit(id)

    this.hasModel = true
    this._model = new Model()
    var eventHandler = Object.seal(new EventOrderedHandler())
    Object.defineProperty(this, '_EventHandler', {
      enumerable: false,
      configurable: false,
      value: eventHandler
    })
  }

  static eventTypes(key) {
    const types = {
      INIT: 'INIT',
      CHANGED: 'CHANGED'
    }
    return (key in types) ? types[key] : types
  }

  addSchemaProp(schemaProperty) {
    this._model.addSchemaProp(schemaProperty)
  }

  store(key) {
    var state = this._state.get(key)
    return (state) || {}
  }

  subscribe(type, callback, scope, priority) {
    return this._EventHandler.addEventListener(type, callback, scope, priority)
  }

  update(state) {
    this._state = this._state.update(
      merge(
        cloneDeep(this.store()),
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
      console.log('Store:_dispatch')

      this._EventHandler.dispatch(this.constructor.eventTypes()[eventType], payload || this.store())
    }
  }

  _fillState(state) {
    return this._inModel(state)
  }

  _inModel(object) {
    if (this.hasModel) {
      filterObject(object, (value, key, scope) => {
        return this._model.get().has(key)
      })
    }
    return object
  }
}

export {
  StoreBase
}
