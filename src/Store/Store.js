'use strict'
import {EventOrderedHandler} from '../EventOrderedHandler'
import {assert, staticClassName} from 'flexio-jshelpers'
import {Storage} from './Storage'
import {CLASS_TAG_NAME} from '../CLASS_TAG_NAME'
import {StoreInterface, CHANGED} from './StoreInterface'
import {DataStoreInterface} from './DataStoreInterface'

export const CLASS_TAG_NAME_STORE = Symbol('__HB__STORE__')

export const INIT = 'INIT'

/**
 * @class
 * @description Store is the instance for store data from Component
 * @extends StoreInterface
 * @implements StoreInterface
 */
export class Store extends StoreInterface {
  /**
   * @constructor
   * @param {String} id
   * @param {DataStoreInterface} dataStore
   */
  constructor(id, dataStore) {
    super(id)

    assert(dataStore instanceof DataStoreInterface,
      'hotballoon:' + this.constructor.name + ':constructor: `dataStore` argument should be an instance of `DataStoreInterface`')

    this.debug.color = 'magentaDark'

    var _storage = Storage.create(this._ID, dataStore.model())

    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_STORE
    })

    Object.defineProperties(this, {
      /**
       * @property {Storage}
       * @name Store#_store
       * @protected
       */
      _store: {
        enumerable: false,
        configurable: false,
        get: () => _storage,
        set: (v) => {
          assert(v instanceof Storage,
            'hotballoon:Store:update: _store property assert be an instance of hotballoon/Storage ')
          _storage = v
          this._updated()
        }
      },
      /**
       * @property {EventOrderedHandler}
       * @name Store#_EventHandler
       * @protected
       */
      _EventHandler: {
        enumerable: false,
        configurable: false,
        value: Object.seal(new EventOrderedHandler())
      }
    })

    this._dispatch(INIT)
  }

  /**
   *
   * @param {Component} component
   * @param storeInit
   * @return {Store}
   */
  static create(component, storeInit) {
    return new this(staticClassName(this) + '-' + component.nextID(), storeInit)
  }

  /**
   *
   * @param {String} type
   * @param {Function} callback
   * @param {Object} scope
   * @param {Integer} priority
   */
  subscribe(type, callback, scope, priority) {
    return this._EventHandler.addEventListener(type, callback, scope, priority)
  }

  /**
   * @returns {Object} state frozen
   */
  state() {
    return this._get()
  }

  /**
   * @returns {State#data} state frozen
   */
  data() {
    return this._get().data
  }

  /**
   * @returns {Object} state cloned
   */
  clone() {
    return this._store.clone().data
  }

  /**
   * @private
   */
  _get() {
    return this._store.get()
  }

  /**
   *
   * @param {Object} state
   */
  set(state) {
    this._store = this._store.set(this._ID, state)
  }

  /**
   * @private
   * @param {String} eventType
   * @param {Object} payload
   */
  _dispatch(eventType, payload = this.state()) {
    this._EventHandler.dispatch(eventType, payload)
  }

  /**
   * @private
   */
  _updated() {
    this.debug.log('STORE CHANGED : ' + this._ID).size(2).background()
    this.debug.object(this.state())
    this.debug.print()

    this._dispatch(CHANGED)
  }
}
