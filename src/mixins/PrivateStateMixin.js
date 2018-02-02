import {
  MapExtended
} from 'flexio-jshelpers'

export const PrivateStateMixin = (Base) => class extends Base {
  PrivateStateMixinInit() {
    this._privateState = new MapExtended()
    // should(!!id,
    //   'hotballoon:RequireIDMixin:RequireIDMixinInit: `id` argument should not be empty')
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
