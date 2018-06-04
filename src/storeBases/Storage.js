'use strict'
import { assert, deepFreezeSeal, cloneObject, isObject } from 'flexio-jshelpers'
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

  _cloneState(obj) {
    if (!isObject(obj)) {
      return obj
    }
    if (obj instanceof Date) {
      return new Date(obj.getTime())
    }
    if (Array.isArray(obj)) {
      var clonedArr = []
      obj.forEach((element) => {
        clonedArr.push(this._cloneState(element))
      })
      return clonedArr
    }

    let clonedObj = new obj.constructor()
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        clonedObj[prop] = this._cloneState(obj[prop])
      }
    }
    return clonedObj
  }
}
