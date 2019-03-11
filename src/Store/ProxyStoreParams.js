import {StoreBaseParams} from './StoreBaseParams'
import {assert, isFunction} from 'flexio-jshelpers'
import {TypeCheck} from '../TypeCheck'

/**
 * @template TYPE
 */
export class ProxyStoreParams extends StoreBaseParams {
  /**
   * @constructor
   * @param {(Symbol|String)} id
   * @param {Class<TYPE>} type
   * @param {Function} dataValidate
   * @param {StoreInterface<TYPE>} store
   * @param {Function} mapper
   * @param {StorageInterface<TYPE>} storage
   */
  constructor(id, type, dataValidate, store, mapper, storage) {
    super(id, type, dataValidate, storage)

    assert(TypeCheck.isStoreBase(store ), '`store` argument should be an instance of StoreInterface')
    assert(isFunction(mapper), '`mapper` argument should be a Function')

    this._mapper = mapper
    this._store = store
  }

  /**
   *
   * @return {StoreInterface<TYPE>}
   */
  get store() {
    return this._store
  }

  /**
   *
   * @return {Function}
   */
  get mapper() {
    return this._mapper
  }
}
