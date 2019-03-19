import {WithIDBase} from '../bases/WithIDBase'
import {assert, assertType} from 'flexio-jshelpers'
import {StorageInterface} from './Storage/StorageInterface'

import {EventOrderedHandler} from '../Event/EventOrderedHandler'
import {STORE_CHANGED} from './StoreInterface'
import {ValidationError} from '../Exception/ValidationError'

export const _storage = Symbol('_storage')
export const _EventHandler = Symbol('_EventHandler')
export const _set = Symbol('_set')
export const _get = Symbol('_get')
export const _updated = Symbol('_updated')
export const _dispatch = Symbol('_dispatch')
export const _storeParams = Symbol('_storeParams')

/**
 * @template TYPE
 * @implements {GenericType<TYPE>}
 */
export class StoreBase extends WithIDBase {
  /**
   * @constructor
   * @param {StoreBaseParams<TYPE>} storeBaseParams
   */
  constructor(storeBaseParams) {
    super(storeBaseParams.id)
    var storage = storeBaseParams.storage
    assertType(storage instanceof StorageInterface,
      'hotballoon:' + this.constructor.name + ':constructor: `storage` argument should be an instance of `StorageInterface`')

    Object.defineProperties(this, {
      [_storage]: {
        enumerable: false,
        configurable: false,
        /**
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
       * @property {StoreParams}
       * @name Store#[_storeParams]
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
   * @returns {!StoreState<TYPE>} state frozen
   */
  state() {
    return this[_get]()
  }

  /**
   *
   * @return {Class<TYPE>}
   */
  get __type__() {
    return this[_storeParams].type
  }

  /**
   *
   * @param {Class} constructor
   * @return {boolean}
   */
  isTypeOf(constructor) {
    return this.__type__ === constructor
  }

  /**
   *
   * @return {(Symbol|string)}
   */
  storeId() {
    return this.ID
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
   * @param {!StoreState<TYPE>}  payload
   */
  [_dispatch](eventType, payload = this.state()) {
    this[_EventHandler].dispatch(eventType, payload)
  }

  /**
   *
   * @param {TYPE} dataStore
   */
  [_set](dataStore) {
    const data = this[_storeParams].defaultChecker(dataStore)

    assertType(data instanceof this.__type__,
      'StoreBase:set: `dataStore` should be an instanceof %s',
      this.__type__.constructor.name
    )

    if (!this[_storeParams].validator(data)) {
      throw new ValidationError('StoreBase:set: `dataStore` failed validation')
    }

    this[_storage] = this[_storage].set(this.ID, data)
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
