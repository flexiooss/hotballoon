'use strict'
import {assert, deepFreezeSeal, cloneObject} from 'flexio-jshelpers'
import {State} from '../State'
import {DataStoreInterface} from '../DataStore/DataStoreInterface'
import {StorageInterface} from './StorageInterface'

const _state = Symbol('_state')
const _dataStoreConstructor = Symbol('_dataStoreConstructor')

/**
 * @class
 * @implements StorageInterface
 */
export class InMemoryStorage extends StorageInterface {
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
      [_state]: {
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

    return new InMemoryStorage(
      new State(storeID, dataStore),
      new this[_dataStoreConstructor]()
    )
  }

  /**
   * @returns {State} state
   */
  get() {
    return this[_state]
  }

  /**
   * @returns {State} state cloned
   */
  clone() {
    const cloned = cloneObject(this[_state], true)
    return new State(cloned.storeID, this[_dataStoreConstructor].fromJSON(cloned.data))
  }
}
