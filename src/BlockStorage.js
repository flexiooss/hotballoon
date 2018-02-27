import {
  cloneDeep
} from 'lodash'
import {
  deepFreezeSeal
} from 'flexio-jshelpers'

export class BlockStorage {
  constructor() {
    Object.defineProperty(this, '_state', {
      enumerable: false,
      writable: false,
      configurable: false,
      value: state
    })
  }
  static create(state) {
    state = cloneDeep(state) || {}
    // console.log('StoreState:create')
    // console.log(state)

    const storeState = new StoreState()
    // return Object.freeze(storeState)
    return deepFreezeSeal(storeState)
  }

  set(state) {
    this._set(state)
  }
  get(key) {
    return this._get(key)
  }

  _getState() {
    return deepFreezeSeal(this._state || {})
  }
}
