import {deepFreezeSeal} from '@flexio-oss/js-type-helpers'

/**
 * @implements {GenericType<TYPE>}
 * @template TYPE
 */
export class StoreState {
  /**
   *
   * @param {(string|Symbol)} storeID
   * @param {TYPE.} type
   * @param {TYPE} dataStore
   */
  constructor(storeID, type, dataStore) {
    this.__storeID = storeID
    this.__data = dataStore
    this.__time = new Date()
    this.__type = type
    return deepFreezeSeal(this)
  }

  /**
   *
   * @return {(string|Symbol)}
   */
   storeID() {
    return this.__storeID
  }

  /**
   *
   * @return {TYPE}
   */
   data() {
    return this.__data
  }

  /**
   *
   * @return {Date}
   */
   time() {
    return this.__time
  }

  /**
   *
   * @return {TYPE.}
   * @private
   */
   __type__() {
    return this.__type
  }

  /**
   *
   * @param {Class} constructor
   * @return {boolean}
   */
  isTypeOf(constructor) {
    return constructor === this.__type__()
  }
}
