import {StoreBaseConfig} from './StoreBaseConfig.js'
import {TypeCheck as TypeTypeCheck} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {TypeCheck} from '../Types/TypeCheck.js'

/**
 *
 * @template STORE_TYPE
 * @template TYPE
 * @template TYPE_BUILDER
 */
export class ProxyStoreConfig extends StoreBaseConfig {
  /**
   * @param {(Symbol|String)} id
   * @param {TYPE} initialData
   * @param {StoreInterface<STORE_TYPE>} store
   * @param {StoreTypeConfig<TYPE, TYPE_BUILDER>} storeTypeConfig
   * @param {(function(state: STORE_TYPE, proxyStore: ?StoreInterface<TYPE>): TYPE) | (function(state: STORE_TYPE, proxyStore: ?StoreInterface<TYPE>): Promise<TYPE>)}  mapper
   * @param {StorageInterface<TYPE>} storage
   */
  constructor(id, initialData, store, storeTypeConfig, mapper, storage) {
    super(id, initialData, storeTypeConfig, storage)

    /**
     * @type {(function(state: STORE_TYPE, proxyStore: ?StoreInterface<TYPE>): TYPE) | (function(state: STORE_TYPE, proxyStore: ?StoreInterface<TYPE>): Promise<TYPE>)}
     * @private
     */
    this._mapper = TypeTypeCheck.assertIsFunction(mapper)
    /**
     * @type {StoreInterface<STORE_TYPE>}
     * @private
     */
    this._store = TypeCheck.assertStoreBase(store)
  }

  /**
   * @return {StoreInterface<STORE_TYPE>}
   */
  store() {
    return this._store
  }

  /**
   * @return{(function(state: STORE_TYPE, proxyStore: ?StoreInterface<TYPE>): TYPE) | (function(state: STORE_TYPE, proxyStore: ?StoreInterface<TYPE>): Promise<TYPE>)}
   */
  mapper() {
    return this._mapper
  }

  /**
   * @return {StoreTypeConfig<TYPE, TYPE_BUILDER>}
   */
  storeTypeConfig() {
    return this._storeTypeConfig
  }

  /**
   * @return {StorageInterface<TYPE>}
   */
  storage() {
    return this._storage
  }
}
