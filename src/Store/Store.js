'use strict'
import {EventOrderedHandler} from '../Event/EventOrderedHandler'
import {assert, staticClassName} from 'flexio-jshelpers'
import {Storage} from './Storage'
import {CLASS_TAG_NAME, CLASS_TAG_NAME_STORE} from '../HasTagClassNameInterface'
import {StoreInterface, STORE_CHANGED} from './StoreInterface'
import {DataStoreInterface} from './DataStoreInterface'

export const STORE_INIT = Symbol('STORE.INIT')
const _store = Symbol('_store')
const _EventHandler = Symbol('_EventHandler')
const _dataStoreConstructor = Symbol('_dataStoreConstructor')
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
   * @param {DataStoreInterface} dataStoreInit
   */
  constructor(id, dataStoreInit) {
    super(id)

    assert(dataStoreInit instanceof DataStoreInterface,
      'hotballoon:' + this.constructor.name + ':constructor: `dataStore` argument should be an instance of `DataStoreInterface`')

    this.debug.color = 'magentaDark'

    var _storage = Storage.create(this._ID, dataStoreInit)

    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_STORE
    })

    Object.defineProperties(this, {
      [_store]: {
        enumerable: false,
        configurable: false,
        /**
         * @property {Storage}
         * @name Store#_store
         * @protected
         */
        get: () => _storage,
        set: (v) => {
          assert(v instanceof Storage,
            'hotballoon:Store:update: _store property assert be an instance of hotballoon/Storage ')
          _storage = v
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
      },
      /**
       * @property {DataStoreInterface}
       * @name Store#_dataStoreConstructor
       * @protected
       */
      [_dataStoreConstructor]: {
        enumerable: false,
        configurable: false,
        writable: false,
        value: dataStoreInit.constructor
      }
    })

    this[_dispatch](STORE_INIT)
  }

  /**
   *
   * @param {Component} component
   * @param storeInit
   * @return {Store}
   * @static
   * @constructor
   */
  static create(component, storeInit) {
    return new this(`${staticClassName(this)}-${component.nextID()}`, storeInit)
  }

  /**
   * @param {EventListenerOrderedParam} eventListenerOrderedParam
   * @return {String} token
   */
  subscribe(eventListenerOrderedParam) {
    return this[_EventHandler].on(eventListenerOrderedParam)
  }

  /**
   * @returns {Object} state frozen
   */
  state() {
    return this[_get]()
  }

  /**
   * @returns {State#data} state frozen
   */
  data() {
    return this[_get]().data
  }

  /**
   * @returns {Object} state cloned
   */
  clone() {
    return this[_store].clone().data
  }

  /**
   * @private
   */
  [_get]() {
    return this[_store].get()
  }

  /**
   *
   * @param {DataStoreInterface} dataStore
   */
  set(dataStore) {
    assert(dataStore instanceof this[_dataStoreConstructor],
      `hotballoon:${this.constructor.name}:set: \`dataStore\` argument should be an instance of ${this[_dataStoreConstructor].name} `)

    this[_store] = this[_store].set(this.ID, dataStore)
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
