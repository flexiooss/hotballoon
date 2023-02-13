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
export class ProxyStore extends StoreBase {
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
   * @param {ProxyStoreConfig<STORE_TYPE, TYPE, TYPE_BUILDER>} proxyStoreConfig
   */
  constructor(proxyStoreConfig) {
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
   * @return {ProxyStore}
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
    this.#mapAndUpdate(this.#parentStore.state(), STORE_CHANGED)
    this.#subscribeToStore()
    return this
  }

  /**
   * @return {StoreInterface<STORE_TYPE>}
   */
  _store() {
    return this.#parentStore
  }

  /**
   * @return {function(STORE_TYPE, ProxyStore): TYPE}
   * @protected
   */
  _mapper() {
    return this.#config.mapper()
  }

  /**
   * @param {StoreState<STORE_TYPE>} payload
   * @param {string} eventType
   */
  #mapAndUpdate(payload, eventType) {
    /**
     * @type {TYPE}
     */
    const state = this._mapper().call(null, payload.data(), this.state().data())
    if (this.#shouldUpdate) {
      this.set(state)
    }
    this.shouldUpdate()
  }

  /**
   * @return {ProxyStore}
   */
  shouldUpdate() {
    this.#shouldUpdate = true
    return this
  }

  /**
   * @return {ProxyStore}
   */
  shouldNotUpdate() {
    this.#shouldUpdate = false
    return this
  }

  remove() {
    this.#listenedStore.remove()
    super.remove()
  }
}
