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
   * @type {number}
   */
  #maxInitialMapping = 10

  /**
   * @param {number} value
   * @return {AsyncProxyStoreBuilder}
   */
  maxInitialMapping(value) {
    this.#maxInitialMapping = value;
    return this
  }

  /**
   * @return {AsyncProxyStoreBuilder}
   */
  asyncInitialValue() {
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
    /**
     * @type {?TYPE}
     */
    let iniV = null

    if (!this.#asyncInitialValue) {
      /**
       * @type {number}
       */
      let parentInvoked = 0
      /**
       * @type {ListenedStore}
       */
      const storeHandler = this._store.listenChanged(() => {
        parentInvoked++
      })
      /**
       * @type {number}
       */
      let invoked = parentInvoked
      /**
       * @type {number}
       */
      let iteration = 0

      do {
        invoked = parentInvoked
        iniV = await this._mapper.call(null, this._store.state().data())
        iteration++
      } while (invoked !== parentInvoked && iteration <= this.#maxInitialMapping)

      storeHandler.remove()
    }

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
