import {
  staticClassName
} from './helpers'
import {
  StoreState
} from './StoreState'
import {
  shouldIs
} from './shouldIs'
import {
  StoreBase
} from './StoreBase'

class Store extends StoreBase {
  constructor() {
    super()

    var storeState = StoreState.create()
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

  static eventTypes() {
    const name = staticClassName(this).toUpperCase()
    return {
      INIT: name + '_INIT',
      CHANGED: name + '_CHANGED'
    }
  }

  _updated() {
    this._dispatch('CHANGED')
  }
}

export {
  Store
}
