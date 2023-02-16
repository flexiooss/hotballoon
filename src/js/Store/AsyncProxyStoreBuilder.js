import {InMemoryStorage} from './Storage/InMemoryStorage.js'
import {StoreState} from './StoreState.js'
import {StoreTypeConfig} from './StoreTypeConfig.js'
import {ProxyStoreConfig} from './ProxyStoreConfig.js'
import {ProxyStoreBuilder} from "./ProxyStoreBuilder.js";
import {AsyncProxyStore} from "./AsyncProxyStore.js";

/**
 *
 * @template  STORE_TYPE, STORE_TYPE_BUILDER,  TYPE, TYPE_BUILDER
 */
export class AsyncProxyStoreBuilder extends ProxyStoreBuilder {
  /**
   * @type {boolean}
   */
  #asyncInitialValue = false

  /**
   * @return {AsyncProxyStoreBuilder}
   */
  asyncInitialValue(){
    this.#asyncInitialValue = true
    return this
  }

  /**
   * @param {function(state: STORE_TYPE, proxyStore:AsyncProxyStore<STORE_TYPE, STORE_TYPE_BUILDER, TYPE, TYPE_BUILDER> ):Promise<TYPE>} mapper
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

    const iniV = this.#asyncInitialValue
      ? null
      : await this._mapper.call(null, this._store.state().data())

    return new AsyncProxyStore(
      new ProxyStoreConfig(
        id,
        iniV,
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
            iniV
          )
        )
      ),
      this.#asyncInitialValue
    )
  }
}
