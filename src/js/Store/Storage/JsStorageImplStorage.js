import {isNull, TypeCheck} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {StoreState, StoreStateBuilder} from '../StoreState.js'
import {StorageInterface} from './StorageInterface.js'
import {Logger} from '@flexio-oss/js-commons-bundle/hot-log/index.js'
import {BaseException} from '@flexio-oss/js-commons-bundle/js-type-helpers/index.js'
import {Base64} from '@flexio-oss/js-commons-bundle/js-helpers/index.js'
import {assert} from '@flexio-oss/js-commons-bundle/assert'

/**
 *
 * @class
 * @template TYPE
 * @implements {StorageInterface<TYPE>}
 * @implements {GenericType<TYPE>}
 * @extends {StorageInterface<TYPE>}
 */
export class JsStorageImplStorage extends StorageInterface {
  /**
   * States shared by every instance, per backing storage then per key
   * Not a WeakMap: invalidate() iterates it
   * @type {Map<Storage, Map<string, ?StoreState>>}
   */
  static #cachesByStorage = new Map()

  /**
   * @type {?TYPE}
   */
  #type
  /**
   * @type {String}
   */
  #key
  /**
   * @type {String}
   */
  #storeID
  /**
   * @type {Storage}
   */
  #storage
  /**
   * Shared state last seen by this instance, and its copy stamped with this instance's ID and type
   * @type {?StoreState}
   */
  #lastSharedState = null
  /**
   * @type {?StoreState<TYPE>}
   */
  #lastState = null

  /**
   * @param {?TYPE.} type
   * @param {string} storeID
   * @param {Storage} storage
   * @param {string} key
   */
  constructor(type, storeID, storage, key) {
    super()
    this.#type = TypeCheck.assertIsClassOrNull(type)
    this.#key = TypeCheck.assertIsString(key)
    this.#storeID = TypeCheck.assertIsString(storeID)
    this.#storage = storage
  }

  /**
   * @param {string} key
   */
  static invalidate(key) {
    JsStorageImplStorage.#cachesByStorage.forEach((cache) => cache.delete(key))
  }

  /**
   * @return {Map<string, ?StoreState>}
   */
  #cache() {
    if (!JsStorageImplStorage.#cachesByStorage.has(this.#storage)) {
      JsStorageImplStorage.#cachesByStorage.set(this.#storage, new Map())
    }
    return JsStorageImplStorage.#cachesByStorage.get(this.#storage)
  }

  /**
   * @param {?StoreState} sharedState
   * @return {?StoreState<TYPE>}
   */
  #ownState(sharedState) {
    if (sharedState !== this.#lastSharedState) {
      this.#lastSharedState = sharedState
      if (isNull(sharedState)
        || (sharedState.storeID() === this.#storeID && sharedState.isTypeOf(this.#type))
      ) {
        this.#lastState = sharedState
      } else {
        assert(sharedState.isTypeOf(this.#type), 'JS Stores using the same key must use the same type')
        this.#lastState = new StoreState(this.#storeID, this.#type, sharedState.data(), sharedState.time())
      }
    }
    return this.#lastState
  }

  /**
   * @return {string}
   */
  key() {
    return this.#key
  }

  /**
   * @param {(string|Symbol)} storeID
   * @param {?TYPE} data
   * @return {StorageInterface}
   */
  set(storeID, data) {
    const newState = new StoreState(storeID, this.#type, data)
    this.#cache().set(this.key(), newState)
    this.#storage.setItem(this.key(), Base64.encode(JSON.stringify(newState)))
    return this
  }

  /**
   * @returns {?StoreState<TYPE>}
   */
  get() {
    if (this.#cache().has(this.key())) {
      return this.#ownState(this.#cache().get(this.key()))
    }

    let ret = null
    try {
      let data = this.#storage.getItem(this.key())
      if (!isNull(data)) {
        data = Base64.decode(data)
        ret = StoreStateBuilder
          .fromJSON(data, this.#type)
          .storeID(this.#storeID)
          .build()
      }
      this.#cache().set(this.key(), ret)
      ret = this.#ownState(ret)
    } catch (e) {
      if (!(e instanceof BaseException)) {
        e = new BaseException(e.toString())
      }

      Logger.getLogger(this.constructor.name, 'JsStorageImplStorage').error('error on retrieve storage data', e)
    }

    return ret
  }

  /**
   * @return {Class<TYPE>}
   */
  __type__() {
    return this.#type
  }

  /**
   * @param {Class} constructor
   * @return {boolean}
   */
  isTypeOf(constructor) {
    if (isNull(this.__type__())) {
      return isNull(constructor)
    }
    return constructor === this.__type__()
  }

  /**
   * @param {string|Symbol} storeId
   */
  clean(storeId) {
    this.#cache().delete(this.key())
    this.#storage.removeItem(this.key())
  }

  /**
   * @param {string|Symbol} storeId
   */
  remove(storeId) {
    //DO NOTHING
  }
}
