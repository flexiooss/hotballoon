import {InMemoryStorage} from './Storage/InMemoryStorage.js'
import {StoreState} from './StoreState.js'
import {StoreTypeConfig} from './StoreTypeConfig.js'
import {ProxyStoreConfig} from './ProxyStoreConfig.js'
import {ProxyStoreBuilder} from './ProxyStoreBuilder.js'
import {OnDemandProxyStore} from './OnDemandProxyStore.js'

/**
 *
 * @template  STORE_TYPE, STORE_TYPE_BUILDER,  TYPE, TYPE_BUILDER
 */
export class OnDemandProxyStoreBuilder extends ProxyStoreBuilder {

  /**
   * @return {ProxyStore<STORE_TYPE, STORE_TYPE_BUILDER, TYPE, TYPE_BUILDER>}
   */
  build() {
    return new OnDemandProxyStore(this._buildProxyStoreConfig());
  }
}
