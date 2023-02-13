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

    const id = this._uniqName()
    const data = this._store.state().data()
    const initialData = this._mapper(data)

    return new OnDemandProxyStore(
      new ProxyStoreConfig(
        id,
        initialData,
        this._store,
        new StoreTypeConfig(
          this._type,
          this._defaultChecker,
          this._validator
        ),
        this._mapper,
        new InMemoryStorage(
          this._type,
          new StoreState(
            id,
            this._type,
            initialData
          )
        )
      )
    )
  }
}
