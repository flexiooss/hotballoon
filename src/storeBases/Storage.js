'use strict'
import {
  deepFreezeSeal,
  cloneWithJsonMethod
} from 'flexio-jshelpers'

const DEFAULT_STORE = {}

/**
 * @class
 * @description simple allocation of storage for Store
 */
export class Storage {
  /**
     * @constructor
     * @param {Object} state
     */
  constructor(state = DEFAULT_STORE) {
    Object.defineProperty(this, '_state', {
      enumerable: false,
      configurable: false,
      get: () => {
        return cloneWithJsonMethod(state)
      },
      set: (v) => false
    })
    deepFreezeSeal(this)
  }

  /**
     * @static
     * @param {Object} state
     */
  static create(state) {
    return new Storage(state)
  }

  /**
     *
     * @param {Object} state
     */
  set(state) {
    return this.constructor.create(state)
  }

  /**
     * @returns {Object} state
     */
  get() {
    return this._state
  }
}
