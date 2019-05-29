import {StoreBaseParams} from './StoreBaseParams'
import {assert, isFunction} from '@flexio-oss/assert'
import {TypeCheck} from '../TypeCheck'

/**
 * @template STORE_TYPE, TYPE
 */
export class ProxyStoreParams extends StoreBaseParams {
  /**
   * @constructor
   * @param {(Symbol|String)} id
   * @param {StoreInterface<STORE_TYPE>} store
   * @param {StoreTypeParam<TYPE>} typeParameter
   * @param {ProxyStoreParams~mapperClb<TYPE>} mapper
   * @param {StorageInterface<TYPE>} storage
   */
  constructor(id, store, typeParameter, mapper, storage) {
    super(id, typeParameter, storage)

    assert(TypeCheck.isStoreBase(store), '`store` argument should be an instance of StoreInterface')
    assert(isFunction(mapper), '`mapper` argument should be a Function')

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
   * @return {ProxyStoreParams~mapperClb<TYPE>}
   */
  get mapper() {
    return this._mapper
  }

  /**
   * @template STORE_TYPE, TYPE
   * @callback ProxyStoreParams~mapperClb
   * @param {STORE_TYPE} v
   * @return {TYPE}
   */
}
