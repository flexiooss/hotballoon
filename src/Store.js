import {
  StoreState
} from './StoreState'
import {
  should
} from './helpers'
import {
  StoreBase
} from './bases/StoreBase'

class Store extends StoreBase {
  constructor(id) {
    super(id)

    var storeState = StoreState.create()
    Object.defineProperty(this, '_state', {
      enumerable: false,
      configurable: false,
      get: () => storeState,
      set: (newStoreState) => {
        should(newStoreState instanceof StoreState,
          'hotballoon:Store:update: _state property should be an instance of hotballoon/StoreState ')
        storeState = newStoreState
        this._updated()
      }
    })
    this._dispatch('INIT')
  }

  _updated() {
    this._dispatch('CHANGED')
  }
}

export {
  Store
}
