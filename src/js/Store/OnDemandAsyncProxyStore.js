import {StoreState} from './StoreState.js'
import {ProxyStore} from './ProxyStore.js'
import {AsyncProxyStore} from "./AsyncProxyStore";

/**
 *
 * @template STORE_TYPE
 * @template TYPE
 * @template TYPE_BUILDER
 * @implements {StoreInterface<TYPE>}
 * @implements {HasTagClassNameInterface}
 * @implements {GenericType<TYPE>}
 */
export class OnDemandAsyncProxyStore extends AsyncProxyStore {
  /**
   * @returns {StoreState<TYPE>} state frozen
   */
  state() {
    throw new Error('OnDemandAsyncProxyStore:state() can not be sync');
  }

  /**
   * @returns {Promise<StoreState<TYPE>>}
   */
  async asyncState() {
    return new StoreState(
      this.ID(),
      this.__type__(),
      this.validateDataStore(await this._mapper().call(null, (await this._store().asyncState()).data(), this,true))
    )
  }

  /**
   * @protected
   * @param {String} eventType
   * @param {!StoreState<TYPE>}  payload
   */
  _dispatch(eventType, payload ) {
    this._eventHandler()?.dispatch(eventType, payload)
  }

  onceOnUpdated(clb) {
    throw new Error('not implemented yet')
  }
}
