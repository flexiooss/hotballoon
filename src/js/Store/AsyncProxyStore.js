import {CLASS_TAG_NAME, CLASS_TAG_NAME_PROXYSTORE} from '../Types/HasTagClassNameInterface.js'
import {StoreBase} from './StoreBase.js'
import {StoreBaseConfig} from './StoreBaseConfig.js'
import {assertInstanceOf, isNull} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {ProxyStoreConfig} from './ProxyStoreConfig.js'
import {TypeCheck} from "../Types/TypeCheck.js";
import {STORE_CHANGED} from "./StoreInterface.js";


/**
 * @implements {StoreInterface<TYPE>}
 * @implements {HasTagClassNameInterface}
 * @implements {GenericType<TYPE>}
 * @template STORE_TYPE, TYPE, TYPE_BUILDER
 */
export class AsyncProxyStore extends StoreBase {
  /**
   * @type {boolean}
   */
  #shouldUpdate = true
  /**
   * @type ProxyStoreConfig<STORE_TYPE, TYPE, TYPE_BUILDER>
   */
  #config
  /**
   * @type {?ListenedStore}
   */
  #listenedStore = null
  /**
   * @type {StoreInterface<STORE_TYPE>}
   */
  #parentStore
  /**
   * @type {?TYPE}
   */
  #initialData = null

  /**
   * @param {ProxyStoreConfig<STORE_TYPE, TYPE, TYPE_BUILDER>} proxyStoreConfig
   * @param {boolean} asyncInitialValue
   */
  constructor(proxyStoreConfig, asyncInitialValue) {
    super(
      new StoreBaseConfig(
        proxyStoreConfig.id(),
        proxyStoreConfig.initialData(),
        proxyStoreConfig.storeTypeConfig(),
        proxyStoreConfig.storage()
      )
    )

    this.#config = assertInstanceOf(proxyStoreConfig, ProxyStoreConfig, 'ProxyStoreConfig')

    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_PROXYSTORE
    })
    this.#parentStore = TypeCheck.assertStoreBase(this.#config.store())

    this.#subscribeToStore()
    if (asyncInitialValue) {
      this._mapper().call(null, this.#parentStore.state().data(), this).then(v => {
        this.#initialData = v
        this.set(v)
      })
    }
  }

  #subscribeToStore() {
    this.#listenedStore = this._store().listenChanged(
      (payload, eventType) => {
        this.#mapAndUpdate(payload, eventType)
      }
    )
  }

  /**
   * @param {StoreInterface<STORE_TYPE>} store
   * @return {AsyncProxyStore}
   * @throws {TypeError}
   */
  changeParentStore(store) {
    if (store.__type__() !== this.#parentStore.__type__()) {
      throw new TypeError('New parent store should have same type as previous : ' + this.#parentStore.__type__().toString())
    }
    if (!isNull(this.#listenedStore)) {
      this.#listenedStore.remove()
    }
    this.#parentStore = TypeCheck.assertStoreBase(store)
    this.#subscribeToStore()
    this.#mapAndUpdate(this.#parentStore.state(), STORE_CHANGED)
    return this
  }

  /**
   * @return {StoreInterface<STORE_TYPE>}
   */
  _store() {
    return this.#parentStore
  }

  /**
   * @return {function(STORE_TYPE, AsyncProxyStore): Promise<TYPE>}
   * @protected
   */
  _mapper() {
    return this.#config.mapper()
  }

  /**
   * @param {StoreState<STORE_TYPE>} payload
   * @param {string} eventType
   */
  async #mapAndUpdate(payload, eventType) {
    /**
     * @type {TYPE}
     */
    const state = await this._mapper().call(null, payload.data(), this)
    if (this.#shouldUpdate) {
      this.set(state)
    }
    this.shouldUpdate()
  }

  /**
   * @return {Promise<AsyncProxyStore>}
   */
  async mapAndUpdate() {
    await this.#mapAndUpdate(this.#parentStore.state(), STORE_CHANGED)
    return this
  }

  /**
   * @return {AsyncProxyStore}
   */
  shouldUpdate() {
    this.#shouldUpdate = true
    return this
  }

  /**
   * @return {AsyncProxyStore}
   */
  shouldNotUpdate() {
    this.#shouldUpdate = false
    return this
  }

  /**
   * Set value to initial data
   */
  reset() {
    this.set(this.#initialData)
  }

  remove() {
    this.#listenedStore.remove()
    super.remove()
  }
}
