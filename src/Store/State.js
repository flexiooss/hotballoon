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
   * @param {string} storeId
   * @param {*} data
   * @return {State}
   * @constructor
   * @static
   */
  static create(storeId, data) {
    return this(storeId, data)
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
