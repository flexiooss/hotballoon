'use strict'
import {
  MapExtended
} from 'flexio-jshelpers'

export const PrivateStateMixin = (Base) => class extends Base {
  PrivateStateMixinInit() {
    this._privateState = new MapExtended()
    // assert(!!id,
    //   'hotballoon:RequireIDMixin:RequireIDMixinInit: `id` argument assert not be empty')
    // Object.defineProperty(this, '_ID', {
    //   enumerable: true,
    //   configurable: false,
    //   writable: false,
    //   value: id
    // })
  }
  _setState(key, value) {
    this._privateState.set(key, value)
  }
  _state(key) {
    return this._privateState.get(key)
  }
  _delete(key) {
    this._privateState.delete(key)
  }
}
