'use strict'
import {EventOrderedHandler} from '../EventOrderedHandler'
import {assert, staticClassName, LogHandler} from 'flexio-jshelpers'
import {RequireIDMixin} from '../mixins/RequireIDMixin'
import {Storage} from './Storage'

export const INIT = 'INIT'
export const CHANGED = 'CHANGED'

/**
 * @class
 * @description Store is the instance for store data from Component
 * @extends RequireIDMixin
 */
export class Store extends RequireIDMixin(class {
}) {
  /**
   * @constructor
   * @param {String} id
   * @param {Store} storage
   */
  constructor(id, storeInit) {
    super()
    this.RequireIDMixinInit(id)

    var _storage = Storage.create(this._ID, storeInit)
    const EVENT_HANDLER = Object.seal(new EventOrderedHandler())

    // assert(storage instanceof Storage,
    //   'hotballoon:StoreHandler:constructor: `storage` argument should be a `Storage` instance')

    Object.defineProperties(this, {
      '__HB__CLASSNAME__': {
        configurable: false,
        writable: false,
        enumerable: true,
        value: '__HB__STORE__'
      },
      /**
       * @property {Storage}
       * @name Store#_store
       * @protected
       */
      _store: {
        enumerable: false,
        configurable: false,
        get: () => _storage,
        set: (storageCandidate) => {
          assert(storageCandidate instanceof Storage,
            'hotballoon:Store:update: _store property assert be an instance of hotballoon/Storage ')
          _storage = storageCandidate
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
        value: EVENT_HANDLER
      },
      /**
       * @property {LogHandler}
       * @name Store#debug
       */
      debug: {
        configurable: false,
        enumerable: false,
        value: new LogHandler(this.constructor.name, 'magentaDark')
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
   * @returns {Object} state frozen
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
