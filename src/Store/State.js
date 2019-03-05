'use strict'
import {deepFreezeSeal, UID} from 'flexio-jshelpers'

/**
 * @template TYPE
 */
export class State {
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
         * @type {(string|Symbol)}
         * @name State#storeID
         */
        value: storeID
      },
      data: {
        configurable: false,
        writable: false,
        enumerable: true,
        /**
         * @type {TYPE}
         * @name State#data
         */
        value: dataStore
      },
      uid: {
        configurable: false,
        writable: false,
        enumerable: true,
        /**
         * @type {(string|Symbol)}
         * @name State#uid
         */
        value: UID(storeID)
      },
      type: {
        configurable: false,
        writable: false,
        enumerable: true,
        /**
         * @type {Class<TYPE>}
         * @name State#type
         */
        value: type
      }
    })
    deepFreezeSeal(this)
  }
}
