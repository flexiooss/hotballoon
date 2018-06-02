'use strict'
import { EventOrderedHandler } from '../EventOrderedHandler'
import { assert } from 'flexio-jshelpers'
import { RequireIDMixin } from '../mixins/RequireIDMixin'
import { Storage } from './Storage'

const EVENT_HANDLER = Object.seal(new EventOrderedHandler())

export const INIT = 'INIT'
export const CHANGED = 'CHANGED'

/**
 * @class
 * @description Store is the instance for store data from Component
 * @extends RequireIDMixin
 */
export class Store extends RequireIDMixin(class { }) {
  /**
     * @constructor
     * @param {String} id
     * @param {Store} storage
     */
  constructor(id, storeInit) {
    super()
    this.RequireIDMixinInit(id)

    var _storage = Storage.create(this._ID, storeInit)

    // assert(storage instanceof Storage,
    //   'hotballoon:StoreHandler:constructor: `storage` argument should be a `Storage` instance')

    Object.defineProperties(this, {
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
      _EventHandler: {
        enumerable: false,
        configurable: false,
        value: EVENT_HANDLER
      }
    })

    this._dispatch(INIT)
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
     * @returns {Object} state cloned
     */
  clone() {
    return this._store._clone()
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
    this._dispatch(CHANGED)
  }
}
