'use strict'
import {assert, deepFreezeSeal} from 'flexio-jshelpers'
import {State} from '../State'
import {StorageInterface} from './StorageInterface'

const _state = Symbol('_state')

/**
 * @template TYPE
 * @implements {StorageInterface<TYPE>}
 * @extends {StorageInterface<TYPE>}
 */
export class InMemoryStorage extends StorageInterface {
  /**
   * @constructor
   * @param {Class<TYPE>} type
   * @param {State<TYPE>} state
   */
  constructor(type, state) {
    super()

    assert(state instanceof State,
      'hotballoon:Storage:constructor: `state` argument should be a `State` instance')

    Object.defineProperties(this, {
      [_state]: {
        enumerable: false,
        configurable: false,
        writable: false,
        value: state
      },
      type: {
        configurable: false,
        writable: false,
        enumerable: true,
        /**
         * @type {Class<TYPE>}
         * @name InMemoryStorage#type
         */
        value: type
      }

    })

    deepFreezeSeal(this)
  }

  /**
   *
   * @param {(string|Symbol)} storeID
   * @param {TYPE} data
   * @return {InMemoryStorage<TYPE>}
   */
  set(storeID, data) {
    return new InMemoryStorage(
      this.type,
      new State(storeID, this.type, data)
    )
  }

  /**
   * @returns {State<TYPE>}
   */
  get() {
    return this[_state]
  }
}
