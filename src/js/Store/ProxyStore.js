import {CLASS_TAG_NAME, CLASS_TAG_NAME_PROXYSTORE} from '../Types/HasTagClassNameInterface'
import {StoreBase} from './StoreBase'
import {StoreBaseConfig} from './StoreBaseConfig'
import {assertInstanceOf, assertType} from '@flexio-oss/js-commons-bundle/assert'
import {ProxyStoreConfig} from './ProxyStoreConfig'
import {StoreState} from './StoreState'


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

    if ('logger' in this._store()) {
      this.setLogger(this._store().logger())
    }

    this.#subscribeToStore()
  }

  #subscribeToStore() {
    this._store().listenChanged(
      (payload, eventType) => {
        this.#mapAndUpdate(payload, eventType)
      }
    )
  }

  /**
   * @return {StoreInterface<STORE_TYPE>}
   */
  _store() {
    return this.#config.store()
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
    const state = this._mapper().call(null, payload.data(), this)
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
}
