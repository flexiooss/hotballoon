import {WithIDBase} from '../bases/WithIDBase'
import {assert} from 'flexio-jshelpers'
import {StorageInterface} from './Storage/StorageInterface'

import {EventOrderedHandler} from '../Event/EventOrderedHandler'
import {STORE_CHANGED} from './StoreInterface'

export const _storage = Symbol('_storage')
export const _EventHandler = Symbol('_EventHandler')
export const _set = Symbol('_set')
export const _get = Symbol('_get')
export const _updated = Symbol('_updated')
export const _dispatch = Symbol('_dispatch')
export const _dataValidate = Symbol('_dataValidate')
export const _storeParams = Symbol('_storeParams')

/**
 * @template TYPE
 */
export class StoreBase extends WithIDBase {
  /**
   * @constructor
   * @param {StoreBaseParams<TYPE>} storeBaseParams
   */
  constructor(storeBaseParams) {
    super(storeBaseParams.id)
    var storage = storeBaseParams.storage
    assert(storage instanceof StorageInterface,
      'hotballoon:' + this.constructor.name + ':constructor: `storage` argument should be an instance of `StorageInterface`')

    Object.defineProperties(this, {
      [_storage]: {
        enumerable: false,
        configurable: false,
        /**
         * @type {StorageInterface<TYPE>}
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
       * @property {EventOrderedHandler}
       * @name Store#_EventHandler
       * @protected
       */
      [_EventHandler]: {
        enumerable: false,
        configurable: false,
        value: Object.seal(new EventOrderedHandler())
      },
      /**
       * @property {_storeParams}
       * @name Store#_storeParams
       * @protected
       */
      [_storeParams]: {
        enumerable: false,
        configurable: false,
        writable: false,
        value: storeBaseParams
      }

    })
  }

  /**
   * @returns {!State<TYPE>} state frozen
   */
  state() {
    return this[_get]()
  }

  /**
   *
   * @return {Class<TYPE>}
   */
  get type() {
    return this[_storeParams].type
  }

  /**
   *
   * @return {(Symbol|string)}
   */
  storeId() {
    return this.ID
  }

  /**
   *
   * @param {Class} constructor
   * @return {boolean}
   */
  isStoreOf(constructor) {
    return this.type === constructor
  }

  /**
   * @param {EventListenerOrderedParam} eventListenerOrderedParam
   * @return {String} token
   */
  subscribe(eventListenerOrderedParam) {
    return this[_EventHandler].on(eventListenerOrderedParam)
  }

  /**
   * @private
   * @param {String} eventType
   * @param {!State<TYPE>}  payload
   */
  [_dispatch](eventType, payload = this.state()) {
    this[_EventHandler].dispatch(eventType, payload)
  }

  /**
   *
   * @param {TYPE} dataStore
   */
  [_set](dataStore) {
    assert(dataStore instanceof this.type,
      'StoreBase:set: `dataStore` should be an instanceof %s',
      this.type.constructor.name
    )
    assert(this[_storeParams].dataValidate(dataStore),
      'StoreBase:set: `dataStore` failed validation'
    )
    this[_storage] = this[_storage].set(this.ID, dataStore)
  }

  /**
   * @private
   * @return {!StorageInterface<TYPE>}
   */
  [_get]() {
    return this[_storage].get()
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
