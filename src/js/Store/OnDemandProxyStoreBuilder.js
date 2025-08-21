import {ProxyStoreBuilder} from './ProxyStoreBuilder.js'
import {OnDemandProxyStore} from './OnDemandProxyStore.js'

/**
 *
 * @template STORE_TYPE
 * @template STORE_TYPE_BUILDER
 * @template TYPE
 * @template TYPE_BUILDER
 */
export class OnDemandProxyStoreBuilder extends ProxyStoreBuilder {
  /**
   * @param {function(state: STORE_TYPE, proxyStore:?TYPE ):TYPE} mapper
   * @return {this}
   */
  mapper(mapper) {
    return super.mapper(mapper)
  }

  /**
   * @return {ProxyStore<STORE_TYPE, STORE_TYPE_BUILDER, TYPE, TYPE_BUILDER>}
   */
  build() {
    return new OnDemandProxyStore(this._buildProxyStoreConfig())
  }
}
