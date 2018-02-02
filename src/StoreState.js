import {
  cloneDeep
} from 'lodash'
import {
  deepFreezeSeal
} from 'flexio-jshelpers'

class StoreState {
  static create(state) {
    state = cloneDeep(state) || {}
    // console.log('StoreState:create')
    // console.log(state)

    const storeState = new StoreState()
    Object.defineProperty(storeState, '_state', {
      enumerable: false,
      writable: false,
      configurable: false,
      value: state
    })
    // return Object.freeze(storeState)
    return deepFreezeSeal(storeState)
  }

  update(state) {
    return StoreState.create(state)
  }
  get(key) {
    return (key && (key in this._state)) ? this._getState()[key] : this._getState()
  }

  _getState() {
    return deepFreezeSeal(this._state || {})
  }
}
export {
  StoreState
}
