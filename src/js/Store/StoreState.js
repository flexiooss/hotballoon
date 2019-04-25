'use strict'
import {deepFreezeSeal, UID} from 'flexio-jshelpers'

/**
 * @implements {GenericType<TYPE>}
 * @template TYPE
 */
export class StoreState {
  /**
   *
   * @param {(string|Symbol)} storeID
   * @param {Class<TYPE>} type
   * @param {TYPE} dataStore
   */
  constructor(storeID, type, dataStore) {
    Object.defineProperties(this, {
      storeID: {
        configurable: false,
        writable: false,
        enumerable: true,
        /**
         * @params {(string|Symbol)}
         * @name StoreState#storeID
         */
        value: storeID
      },
      data: {
        configurable: false,
        writable: false,
        enumerable: true,
        /**
         * @params {TYPE}
         * @name StoreState#data
         */
        value: dataStore
      },
      time: {
        configurable: false,
        writable: false,
        enumerable: true,
        /**
         * @params {Date}
         * @name StoreState#time
         */
        value: new Date()
      },
      type: {
        configurable: false,
        writable: false,
        enumerable: true,
        /**
         * @params {Class<TYPE>}
         * @name StoreState#type
         */
        value: type
      }
    })
    deepFreezeSeal(this)
  }

  /**
   *
   * @return {Class<TYPE>}
   * @private
   */
  get __type__() {
    return this.type
  }

  /**
   *
   * @param {Class} constructor
   * @return {boolean}
   */
  isTypeOf(constructor) {
    return constructor === this.__type__
  }
}