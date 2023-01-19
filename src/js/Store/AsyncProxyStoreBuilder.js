import {InMemoryStorage} from './Storage/InMemoryStorage'
import {StoreState} from './StoreState'
import {StoreTypeConfig} from './StoreTypeConfig'
import {ProxyStoreConfig} from './ProxyStoreConfig'
import {ProxyStoreBuilder} from "./ProxyStoreBuilder";
import {AsyncProxyStore} from "./AsyncProxyStore";

/**
 *
 * @template  STORE_TYPE, STORE_TYPE_BUILDER,  TYPE, TYPE_BUILDER
 */
export class AsyncProxyStoreBuilder extends ProxyStoreBuilder {


  /**
   * @param {function(state: STORE_TYPE, proxyStore:?TYPE ):Promise<TYPE>} mapper
   * @return {ProxyStoreBuilder}
   */
  mapper(mapper) {
    this._mapper = mapper
    return this
  }

  /**
   * @return {Promise<AsyncProxyStore<STORE_TYPE, STORE_TYPE_BUILDER, TYPE, TYPE_BUILDER>>}
   */
  async build() {

    const id = this._uniqName()
    const data = this._store.state().data()
    const initialData = await this._mapper(data, null)

    return new AsyncProxyStore(
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
