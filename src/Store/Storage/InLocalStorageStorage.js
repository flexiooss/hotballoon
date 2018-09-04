'use strict'
/* global localStorage:false */

import {assert, deepFreezeSeal, cloneObject} from 'flexio-jshelpers'
import {State} from '../State'
import {DataStoreInterface} from '../DataStore/DataStoreInterface'
import {StorageInterface} from './StorageInterface'
import {JsonParser} from 'flexio-json-parser'

const _key_ = Symbol('_key_')
const _dataStoreConstructor = Symbol('_dataStoreConstructor')

/**
 * @class
 * @implements StorageInterface
 */
export class InLocalStorageStorage extends StorageInterface {
  /**
   * @constructor
   * @param {State} state
   * @param {DataStoreInterface} dataStore
   */
  constructor(state, dataStore) {
    super()

    assert(state instanceof State,
      'hotballoon:Storage:constructor: `state` argument should be a `State` instance')

    assert(dataStore instanceof DataStoreInterface,
      'hotballoon:' + this.constructor.name + ':constructor: `dataStore` argument should be an instance of `DataStoreInterface`')

    Object.defineProperties(this, {
      [_key_]: {
        enumerable: false,
        configurable: false,
        writable: false,
        value: state
      },

      /**
       * @property {DataStoreInterface}
       * @name InMemoryStorage#_dataStoreConstructor
       * @private
       */
      [_dataStoreConstructor]: {
        enumerable: false,
        configurable: false,
        writable: false,
        value: dataStore.constructor
      }
    })

    deepFreezeSeal(this)
  }

  /**
   *
   * @param {DataStoreInterface} dataStore
   */
  set(storeID, dataStore) {
    assert(dataStore instanceof this[_dataStoreConstructor],
      `hotballoon:${this.constructor.name}:set: \`dataStore\` argument should be an instance of ${this[_dataStoreConstructor].name} `)

    localStorage.setItem(this[_key_], JSON.stringify(new State(storeID, dataStore)))
    return this
  }

  /**
   * @returns {State} state
   */
  get() {
    const cloned = new JsonParser()
      .withDateParserUTCISO8601()
      .parse(localStorage.getItem(this[_key_]))

    return new State(cloned.storeID, this[_dataStoreConstructor].fromJSON(cloned.data))
  }

  /**
   * @returns {State} state cloned
   */
  clone() {
    return this.get()
  }
}
