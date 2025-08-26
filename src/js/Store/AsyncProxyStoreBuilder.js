import {InMemoryStorage} from './Storage/InMemoryStorage.js'
import {StoreState} from './StoreState.js'
import {StoreTypeConfig} from './StoreTypeConfig.js'
import {ProxyStoreConfig} from './ProxyStoreConfig.js'
import {ProxyStoreBuilder} from "./ProxyStoreBuilder.js";
import {AsyncProxyStore} from "./AsyncProxyStore.js";

/**
 *
 * @template STORE_TYPE
 * @template STORE_TYPE_BUILDER
 * @template TYPE
 * @template TYPE_BUILDER
 */
export class AsyncProxyStoreBuilder extends ProxyStoreBuilder {
  /**
   * @type {boolean}
   * @protected
   */
  _asyncInitialValue = false
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
    this._asyncInitialValue = true
    return this
  }

  /**
   * @param {function(state: STORE_TYPE, proxyStore:?StoreInterface<TYPE> ):Promise<TYPE>} mapper
   * @return {ProxyStoreBuilder}
   */
  mapper(mapper) {
    this._mapper = mapper
    return this
  }

  /**
   * @return {Promise<ProxyStoreConfig<STORE_TYPE, TYPE, TYPE_BUILDER>>}
   * @protected
   */
  async _buildProxyStoreConfig() {
    const id = this._uniqName()
    /**
     * @type {?TYPE}
     */
    let iniV = null

    if (!this._asyncInitialValue) {
      /**
       * @type {number}
       */
      let parentInvoked = 0
      /**
       * @type {ListenedStore}
       */
      const storeHandler = this._store.listenChanged(
        builder => builder.callback(() => {
          parentInvoked++
        }).build()
      )
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
        iniV = await this._mapper.call(null, (await this._store.asyncState()).data(), null)
        iteration++
      } while (invoked !== parentInvoked && iteration <= this.#maxInitialMapping)

      storeHandler.remove()
    }

    return new ProxyStoreConfig(
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
    )
  }

  /**
   * @return {Promise<AsyncProxyStore<STORE_TYPE, STORE_TYPE_BUILDER, TYPE, TYPE_BUILDER>>}
   */
  async build() {
    return new AsyncProxyStore(await this._buildProxyStoreConfig(), this._asyncInitialValue);
  }
}
