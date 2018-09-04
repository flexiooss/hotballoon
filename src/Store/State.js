'use strict'
import {deepFreezeSeal} from 'flexio-jshelpers'

/**
 *
 */
export class State {
  /**
   *
   * @param {string} storeID
   * @param {DataStoreInterface} dataStore
   */
  constructor(storeID, dataStore) {
    Object.defineProperties(this, {
      storeID: {
        configurable: false,
        writable: false,
        enumerable: true,
        /**
         * @property {string}
         * @name State#storeID
         */
        value: storeID
      },
      data: {
        configurable: false,
        writable: false,
        enumerable: true,
        /**
         * @property {DataStoreInterface}
         * @name State#data
         */
        value: dataStore
      }
    })
    deepFreezeSeal(this)
  }

  static fromJSON(json) {
    return new State(json.storeID)
  }
}
