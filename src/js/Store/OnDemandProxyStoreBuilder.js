import {InMemoryStorage} from './Storage/InMemoryStorage'
import {StoreState} from './StoreState'
import {StoreTypeConfig} from './StoreTypeConfig'
import {ProxyStore} from './ProxyStore'
import {ProxyStoreConfig} from './ProxyStoreConfig'
import {ProxyStoreBuilder} from './ProxyStoreBuilder'
import {OnDemandProxyStore} from './OnDemandProxyStore'

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
