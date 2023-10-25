import {CLASS_TAG_NAME, CLASS_TAG_NAME_PROXYSTORE} from '../Types/HasTagClassNameInterface.js'
import {StoreBase} from './StoreBase.js'
import {StoreBaseConfig} from './StoreBaseConfig.js'
import {assertInstanceOf, isNull} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {ProxyStoreConfig} from './ProxyStoreConfig.js'
import {TypeCheck} from "../Types/TypeCheck.js";
import {STORE_CHANGED} from "./StoreInterface.js";
import {BaseException} from "@flexio-oss/js-commons-bundle/js-type-helpers/index.js";
import {Logger} from "@flexio-oss/js-commons-bundle/hot-log/index.js";


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
   * @type {?AbortController}
   */
  #controller = null
  /**
   * @type {Logger}
   */
  #logger

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

    this.#logger = Logger.getLogger(this.constructor.name, 'hotballoon.store.AsyncProxyStore', this.ID())
    this.#parentStore = TypeCheck.assertStoreBase(this.#config.store())
    this.#initialData = proxyStoreConfig.initialData()

    this.#subscribeToStore()

    if (asyncInitialValue) {
      this._mapper().call(null, this.#parentStore.state().data(), this).then(v => {
        this.#initialData = v
        this.set(v)
      })
    }
  }

  #subscribeToStore() {
    this.#listenedStore = this._store().listenChanged(builder=>builder
      .callback((payload, eventType) => {
        this.#mapAndUpdate(payload, eventType)
      })
      .build()
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
    if (!isNull(this.#controller)) {
      this.#controller.abort()
    }
    /**
     * @type {AbortController}
     */
    this.#controller = new AbortController();
    try {
      /**
       * @type {TYPE}
       */
      const state = await this.#mapWithAbort(this.#controller.signal, () => this._mapper().call(null, payload.data(), this))
      this.#controller = null
      if (this.#shouldUpdate) {
        this.set(state)
      }
      this.shouldUpdate()

    } catch (e) {
      if (!e instanceof AbortedException) {
        throw e
      } else {
        this.#logger.debug('mapping aborted')
      }
    }
  }

  /**
   * @param{AbortSignal}  abortSignal
   * @param {function():Promise<TYPE>} clb
   * @return {Promise<void>}
   */
  async #mapWithAbort(abortSignal, clb) {

    if (abortSignal?.aborted) {
      return Promise.reject(new AbortedException("Aborted"));
    }
    return new Promise((resolve, reject) => {
      let timeout;
      const abortHandler = () => {
        clearTimeout(timeout);
        reject(new AbortedException("Aborted"));
      }

      timeout = setTimeout(() => {
        resolve(clb.call(null));
        abortSignal?.removeEventListener("abort", abortHandler);
      }, 0);

      abortSignal?.addEventListener("abort", abortHandler);
    });
  }

  /**
   * @return {AsyncProxyStore}
   */
  trigChange() {
    this.mapAndUpdate()
    return this
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

class AbortedException extends BaseException {

  realName() {
    return 'AbortedException';
  }
}
