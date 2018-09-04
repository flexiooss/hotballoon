'use strict'
import {EventOrderedHandler} from '../Event/EventOrderedHandler'
import {assert, staticClassName} from 'flexio-jshelpers'
import {CLASS_TAG_NAME, CLASS_TAG_NAME_STORE} from '../HasTagClassNameInterface'
import {StoreInterface, STORE_CHANGED} from './StoreInterface'
import {StorageInterface} from './Storage/StorageInterface'

export const STORE_INIT = Symbol('STORE.INIT')
const _storage = Symbol('_storage')
const _EventHandler = Symbol('_EventHandler')
const _get = Symbol('_get')
const _updated = Symbol('_updated')
const _dispatch = Symbol('_dispatch')

/**
 * @class
 * @description Store is the instance for store data from Component
 * @extends StoreInterface
 * @implements StoreInterface
 * @implements HasTagClassNameInterface
 */
export class Store extends StoreInterface {
  /**
   * @constructor
   * @param {String} id
   * @param {StorageInterface} storage
   */
  constructor(id, storage) {
    super(id)

    assert(storage instanceof StorageInterface,
      'hotballoon:' + this.constructor.name + ':constructor: `storage` argument should be an instance of `StorageInterface`')

    this.debug.color = 'magentaDark'

    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_STORE
    })

    Object.defineProperties(this, {
      [_storage]: {
        enumerable: false,
        configurable: false,
        /**
         * @property {Storage}
         * @name Store#_storage
         * @protected
         */
        get: () => storage,
        set: (v) => {
          assert(v instanceof StorageInterface,
            'hotballoon:' + this.constructor.name + ':constructor: `storage` argument should be an instance of `StorageInterface`')
          storage = v
          this[_updated]()
        }
      },
      /**
       * @property {EventOrderedHandlerOld}
       * @name Store#_EventHandler
       * @protected
       */
      [_EventHandler]: {
        enumerable: false,
        configurable: false,
        value: Object.seal(new EventOrderedHandler())
      }

    })

    this[_dispatch](STORE_INIT)
  }

  /**
   * @param {EventListenerOrderedParam} eventListenerOrderedParam
   * @return {String} token
   */
  subscribe(eventListenerOrderedParam) {
    return this[_EventHandler].on(eventListenerOrderedParam)
  }

  /**
   * @returns {State} state frozen
   */
  state() {
    return this[_get]()
  }

  /**
   * @returns {DataStoreInterface} state#data frozen
   */
  data() {
    return this[_get]().data
  }

  /**
   * @returns {DataStoreInterface} state#data cloned
   */
  clone() {
    return this[_storage].clone().data
  }

  /**
   * @private
   * @return {StorageInterface}
   */
  [_get]() {
    return this[_storage].get()
  }

  /**
   *
   * @param {DataStoreInterface} dataStore
   */
  set(dataStore) {
    this[_storage] = this[_storage].set(this.ID, dataStore)
  }

  /**
   * @private
   * @param {String} eventType
   * @param {Object} payload
   */
  [_dispatch](eventType, payload = this.state()) {
    this[_EventHandler].dispatch(eventType, payload)
  }

  /**
   * @private
   */
  [_updated]() {
    this.debug.log('STORE STORE_CHANGED : ' + this.ID).size(2).background()
    this.debug.object(this.state())
    this.debug.print()

    this[_dispatch](STORE_CHANGED)
  }
}
