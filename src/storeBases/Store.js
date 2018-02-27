import {
  EventOrderedHandler
} from '../EventOrderedHandler'
import {
  assert,
  deepFreezeSeal
} from 'flexio-jshelpers'
import {
  RequireIDMixin
} from '../mixins/RequireIDMixin'
import {
  Storage
} from './Storage'

const EVENT_HANDLER = Object.seal(new EventOrderedHandler())

export class Store extends RequireIDMixin(class {}) {
  constructor(id, store) {
    super()
    this.RequireIDMixinInit(id)

    assert(store instanceof Storage,
      'hotballoon:StoreHandler:constructor: `store` argument should be a `StoreBase` instance')

    Object.defineProperties(this, {
      _store: {
        enumerable: false,
        configurable: false,
        get: () => store,
        set: (storeCandidate) => {
          assert(storeCandidate instanceof Storage,
            'hotballoon:Store:update: _state property assert be an instance of hotballoon/StoreBase ')
          store = storeCandidate
          this._updated()
        }
      },
      _EventHandler: {
        enumerable: false,
        configurable: false,
        value: EVENT_HANDLER
      }
    })

    this._dispatch(this.constructor.eventType('INIT'))
  }

  static eventType(key) {
    const types = {
      INIT: 'INIT',
      CHANGED: 'CHANGED'
    }
    return (key) ? types[key] : types
  }

  subscribe(type, callback, scope, priority) {
    return this._EventHandler.addEventListener(type, callback, scope, priority)
  }

  state() {
    return deepFreezeSeal(this._get())
  }

  _get() {
    return this._store.get()
  }

  set(state) {
    this._store = this._store.set(state)
  }

  _dispatch(eventType, payload = this.state()) {
    this._EventHandler.dispatch(eventType, payload)
  }

  _updated() {
    this._dispatch(this.constructor.eventType('CHANGED'))
  }
}
