import {CLASS_TAG_NAME, CLASS_TAG_NAME_PROXYSTORE} from '../Types/HasTagClassNameInterface'
import {StoreBase} from './StoreBase'
import {StoreBaseConfig} from './StoreBaseConfig'
import {assertInstanceOf, isNull} from '@flexio-oss/js-commons-bundle/assert'
import {ProxyStoreConfig} from './ProxyStoreConfig'
import {StoreState} from './StoreState'
import {TypeCheck} from "../Types/TypeCheck";
import {STORE_CHANGED} from "./StoreInterface";


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

    this.changeParentStore(this.#config.store())
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
