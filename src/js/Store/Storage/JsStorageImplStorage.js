import {isNull, TypeCheck} from '@flexio-oss/js-commons-bundle/assert'
import {deepFreezeSeal} from '@flexio-oss/js-commons-bundle/js-generator-helpers'
import {StoreState} from '../StoreState'
import {StorageInterface} from './StorageInterface'
import {StoreStateBuilder} from '../StoreState'
import {HotLog, Logger} from "@flexio-oss/js-commons-bundle/hot-log";
import {BaseException} from "@flexio-oss/js-commons-bundle/js-type-helpers";

/**
 * @template TYPE
 * @implements {StorageInterface<TYPE>}
 * @implements {GenericType<TYPE>}
 * @extends {StorageInterface<TYPE>}
 */
export class JsStorageImplStorage extends StorageInterface {
  /**
   * @type {?TYPE.}
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
    deepFreezeSeal(this)
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
    this.#storage.setItem(this.key(), btoa(JSON.stringify(new StoreState(storeID, this.#type, data))))
    return this
  }

  /**
   * @returns {?StoreState<TYPE>}
   */
  get() {
    let ret = null
    try {
      let data = this.#storage.getItem(this.key())
      if (!isNull(data)) {
        data = atob(data)
        ret = StoreStateBuilder
          .fromJSON(data, this.#type)
          .storeID(this.#storeID)
          .build()
      }
    } catch (e) {
      if (!e instanceof BaseException) {
        e = new BaseException(e.toString())
      }

      Logger.getLogger(this.constructor.name, 'JsStorageImplStorage').error('error on retrieve storage data', e)
    } finally {
      return ret
    }

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
}
