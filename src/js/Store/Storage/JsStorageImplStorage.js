import {isNull, TypeCheck} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {StoreState, StoreStateBuilder} from '../StoreState.js'
import {StorageInterface} from './StorageInterface.js'
import {Logger} from '@flexio-oss/js-commons-bundle/hot-log/index.js'
import {BaseException} from '@flexio-oss/js-commons-bundle/js-type-helpers/index.js'
import {Base64} from '@flexio-oss/js-commons-bundle/js-helpers/index.js'

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
   * @type {TYPE}
   */
  #storeData
  /**
   * @type {boolean}
   */
  #loadedData

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

    this.#loadedData = false
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
    this.#storeData = new StoreState(storeID, this.#type, data)
    this.#loadedData = true
    this.#storage.setItem(this.key(), Base64.encode(JSON.stringify(this.#storeData)))
    return this
  }

  /**
   * @returns {?StoreState<TYPE>}
   */
  get() {
    if (this.#loadedData) {
      return this.#storeData
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
      this.#loadedData = true
      this.#storeData = ret
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
    this.#storage.removeItem(this.key())
  }

  /**
   * @param {string|Symbol} storeId
   */
  remove(storeId) {
    //DO NOTHING
  }
}
