import {StoreBaseConfig} from './StoreBaseConfig'
import {assertType, isFunction} from '@flexio-oss/assert'
import {TypeCheck} from '../Types/TypeCheck'

/**
 * @template STORE_TYPE, TYPE, TYPE_BUILDER
 */
export class ProxyStoreConfig extends StoreBaseConfig {
  /**
   * @param {(Symbol|String)} id
   * @param {StoreInterface<STORE_TYPE>} store
   * @param {StoreTypeConfig<TYPE, TYPE_BUILDER>} storeTypeConfig
   * @param {ProxyStoreConfig~mapperClb<STORE_TYPE, TYPE>} mapper
   * @param {StorageInterface<TYPE>} storage
   */
  constructor(id, store, storeTypeConfig, mapper, storage) {
    super(id, storeTypeConfig, storage)

    assertType(TypeCheck.isStoreBase(store), '`store` argument should be an instance of StoreInterface')
    assertType(isFunction(mapper), '`mapper` argument should be a Function')

    this._mapper = mapper
    this._store = store
  }

  /**
   *
   * @return {StoreInterface<STORE_TYPE>}
   */
  get store() {
    return this._store
  }

  /**
   *
   * @return {ProxyStoreConfig~mapperClb<TYPE>}
   */
  get mapper() {
    return this._mapper
  }

  /**
   * @template STORE_TYPE, TYPE
   * @callback ProxyStoreConfig~mapperClb
   * @param {STORE_TYPE} v
   * @return {TYPE}
   */

  /**
   *
   * @return {StoreTypeConfig<TYPE, TYPE_BUILDER>}
   */
  get storeTypeConfig() {
    return this._storeTypeConfig
  }

  /**
   *
   * @return {StorageInterface<TYPE>}
   */
  get storage() {
    return this._storage
  }
}