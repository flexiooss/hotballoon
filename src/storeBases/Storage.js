'use strict'
import { assert, deepFreezeSeal, cloneObject } from 'flexio-jshelpers'
import { State } from './State'

/**
 * @class
 * @description simple allocation of storage for Store
 */
export class Storage {
  /**
     * @constructor
     * @param {Object} state
     */
  constructor(state) {
    assert(state instanceof State,
      'hotballoon:Storage:constructor: `state` argument should be a `State` instance')

    Object.defineProperty(this, '_state', {
      enumerable: false,
      configurable: false,
      get: () => {
        return state
      },
      set: (v) => false
    })
    deepFreezeSeal(this)
  }

  /**
     * @static
     * @param {Object} state
     */
  static create(storeId, state) {
    return new Storage(new State(storeId, state))
  }

  /**
     *
     * @param {Object} state
     */
  set(storeId, state) {
    return this.constructor.create(storeId, state)
  }

  /**
     * @returns {Object} state
     */
  get() {
    return this._state
  }

  /**
     * @returns {Object} state loned
     */
  clone() {
    return cloneObject(this._state, true)
  }
}
