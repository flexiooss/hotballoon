'use strict'
import {deepFreezeSeal} from 'flexio-jshelpers'

export class State {
  /**
   *
   * @param {string} storeId
   * @param {any} data
   */
  constructor(storeId, data) {
    Object.defineProperties(this, {
      storeID: {
        configurable: false,
        writable: false,
        enumerable: true,
        value: storeId
      },
      data: {
        configurable: false,
        writable: false,
        enumerable: true,
        value: data
      }
    })
    deepFreezeSeal(this)
  }

  /**
   *
   * @return {State}
   * @static
   */
  static createEmpty() {
    return new State('', {})
  }
}
