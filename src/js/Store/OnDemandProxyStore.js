import {StoreState} from './StoreState.js'
import {ProxyStore} from './ProxyStore.js'

/**
 * @implements {StoreInterface<TYPE>}
 * @implements {HasTagClassNameInterface}
 * @implements {GenericType<TYPE>}
 * @template STORE_TYPE, TYPE, TYPE_BUILDER
 */
export class OnDemandProxyStore extends ProxyStore {

  /**
   * @returns {StoreState<TYPE>} state frozen
   */
  state() {
    return new StoreState(
      this.ID(),
      this.__type__(),
      this.validateDataStore(this._mapper().call(null, this._store().state().data()))
    )
  }

  /**
   * @protected
   * @param {String} eventType
   * @param {!StoreState<TYPE>}  payload
   */
  _dispatch(eventType, payload = this.state()) {
    this._eventHandler().dispatch(eventType, payload)
  }

  onceOnUpdated(clb) {
    throw new Error('not implemented yet')
  }
}
