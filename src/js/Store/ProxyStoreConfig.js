import {StoreBaseConfig} from './StoreBaseConfig'
import {assertType, isFunction} from '@flexio-oss/js-commons-bundle/assert'
import {TypeCheck} from '../Types/TypeCheck'

/**
 * @template STORE_TYPE, TYPE, TYPE_BUILDER
 */
export class ProxyStoreConfig extends StoreBaseConfig {
  /**
   * @param {(Symbol|String)} id
   * @param {TYPE} initialData
   * @param {StoreInterface<STORE_TYPE>} store
   * @param {StoreTypeConfig<TYPE, TYPE_BUILDER>} storeTypeConfig
   * @param {{function(state: STORE_TYPE ):TYPE}} mapper
   * @param {StorageInterface<TYPE>} storage
   */
  constructor(id, initialData, store, storeTypeConfig, mapper, storage) {
    super(id, initialData, storeTypeConfig, storage)

    assertType(TypeCheck.isStoreBase(store), '`store` argument should be an instance of StoreInterface')

    assertType(isFunction(mapper), '`mapper` argument should be a Function')

    this._mapper = mapper
    this._store = store
  }

  /**
   *
   * @return {StoreInterface<STORE_TYPE>}
   */
  store() {
    return this._store
  }

  /**
   *
   * @return {function(state: STORE_TYPE ):TYPE}
   */
  mapper() {
    return this._mapper
  }

  /**
   *
   * @return {StoreTypeConfig<TYPE, TYPE_BUILDER>}
   */
  storeTypeConfig() {
    return this._storeTypeConfig
  }

  /**
   *
   * @return {StorageInterface<TYPE>}
   */
  storage() {
    return this._storage
  }
}
