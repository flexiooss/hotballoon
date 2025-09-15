import {UID} from '@flexio-oss/js-commons-bundle/js-helpers/index.js'
import {InMemoryStorage} from './Storage/InMemoryStorage.js'
import {StoreState} from './StoreState.js'
import {StoreTypeConfig} from './StoreTypeConfig.js'
import {ProxyStore} from './ProxyStore.js'
import {ProxyStoreConfig} from './ProxyStoreConfig.js'
import {isNull} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {AbstractStoreBuilder} from "./AbstractStoreBuilder.js";

/**
 *
 * @template STORE_TYPE
 * @template STORE_TYPE_BUILDER
 * @template TYPE
 * @template TYPE_BUILDER
 */
export class ProxyStoreBuilder extends AbstractStoreBuilder {
  constructor() {
    super()
    /**
     * @type {?StoreInterface<STORE_TYPE>}
     * @protected
     */
    this._store = null

    /**
     * @type {?ValueObjectValidator}
     * @protected
     */
    this._validator = null
    /**
     * @type {StoreTypeConfig~defaultCheckerClb<TYPE>}
     * @protected
     */
    this._defaultChecker = v => v

    /**
     * @type {function(state: STORE_TYPE,proxyStore:?StoreInterface<TYPE>): TYPE | function(state: STORE_TYPE,proxyStore:?StoreInterface<TYPE>): Promise<TYPE>}  mapper
     * @protected
     */
    this._mapper = null
    /**
     * @type {?string}
     * @protected
     */
    this._name = null
  }

  /**
   * @param {string} name
   * @return {ProxyStoreBuilder}
   */
  name(name) {
    this._name = name.replace(new RegExp('\\s+', 'g'), '')
    return this
  }

  /**
   *
   * @param {StoreInterface<STORE_TYPE, STORE_TYPE_BUILDER>} store
   * @return {ProxyStoreBuilder}
   */
  store(store) {
    this._store = store
    return this
  }

  /**
   * @param {function(state: STORE_TYPE, proxyStore:?TYPE ):TYPE} mapper
   * @return {ProxyStoreBuilder}
   */
  mapper(mapper) {
    this._mapper = mapper
    return this
  }

  /**
   * @param {StoreTypeConfig~defaultCheckerClb<TYPE>} defaultChecker
   * @return {ProxyStoreBuilder}
   */
  defaultChecker(defaultChecker) {
    this._defaultChecker = defaultChecker
    return this
  }

  /**
   * @param {?ValueObjectValidator} validator
   * @return {ProxyStoreBuilder}
   */
  validator(validator) {
    this._validator = validator
    return this
  }

  /**
   * @return {string}
   * @protected
   */
  _uniqName() {
    return UID((isNull(this._name) ? this._type.name : this._name) + '_')
  }

  /**
   * @return {ProxyStoreConfig<STORE_TYPE, TYPE, TYPE_BUILDER>}
   * @protected
   */
  _buildProxyStoreConfig() {
    const id = this._uniqName()
    const data = this._store.state().data()
    const initialData = this._mapper(data, null)
    return new ProxyStoreConfig(
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
  }

  /**
   * @return {ProxyStore<STORE_TYPE, STORE_TYPE_BUILDER, TYPE, TYPE_BUILDER>}
   */
  build() {
    return new ProxyStore(this._buildProxyStoreConfig());
  }
}
