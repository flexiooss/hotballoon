import {assertType, isClass, isNull} from '@flexio-oss/js-commons-bundle/assert'
import {deepFreezeSeal} from '@flexio-oss/js-commons-bundle/js-generator-helpers'
import {StoreState} from '../StoreState'
import {StorageInterface} from './StorageInterface'
import {StoreStateBuilder} from '../StoreState'

/**
 * @template TYPE
 * @implements {StorageInterface<TYPE>}
 * @implements {GenericType<TYPE>}
 * @extends {StorageInterface<TYPE>}
 */
export class LocalStorageStorage extends StorageInterface {
  /**
   * @constructor
   * @param {TYPE.} type
   * @param {string} storeID
   * @param {Window} window
   * @param {string} key
   */
  constructor(type, storeID, window, key) {
    super()

    assertType(
      isClass(type),
      'hotballoon:Storage:constructor: `type` argument should be a Class'
    )

    Object.defineProperties(this, {
      storeID: {
        configurable: false,
        writable: false,
        enumerable: true,
        /**
         * @params {string}
         * @name InMemoryStorage#storeID
         */
        value: type
      },
      type: {
        configurable: false,
        writable: false,
        enumerable: true,
        /**
         * @params {TYPE.}
         * @name InMemoryStorage#type
         */
        value: type
      },
      __key: {
        configurable: false,
        writable: false,
        enumerable: true,
        /**
         * @params {string}
         * @name InMemoryStorage#key
         */
        value: key
      },
      __window: {
        configurable: false,
        writable: false,
        enumerable: false,
        /**
         * @params {Window}
         * @name InMemoryStorage#__window
         */
        value: window
      }

    })

    deepFreezeSeal(this)
  }

  /**
   * @return {string}
   */
  key() {
    return this.__key
  }

  /**
   *
   * @param {(string|Symbol)} storeID
   * @param {TYPE} data
   * @return {LocalStorageStorage<TYPE>}
   */
  set(storeID, data) {

    this.__window.localStorage.setItem(this.key(), JSON.stringify(new StoreState(storeID, this.type, data)))
    return this
  }

  /**
   * @returns {?StoreState<TYPE>}
   */
  get() {
    let data = this.__window.localStorage.getItem(this.key())

    if (!isNull(data)) {
      return StoreStateBuilder
        .fromJSON(data, this.type)
        .storeID(this.storeID)
        .build()
    }
    return null
  }

  /**
   * @return {TYPE.}
   * @private
   */
  __type__() {
    return this.type
  }

  /**
   * @param {Class} constructor
   * @return {boolean}
   */
  isTypeOf(constructor) {
    return constructor === this.__type__()
  }
}
