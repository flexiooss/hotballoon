import {deepFreezeSeal} from '@flexio-oss/js-commons-bundle/js-generator-helpers'
import {assertType, isNull} from '@flexio-oss/js-commons-bundle/assert'

/**
 * @implements {GenericType<TYPE>}
 * @template TYPE
 */
export class StoreState {
  /**
   *
   * @param {(string|Symbol)} storeID
   * @param {TYPE.} type
   * @param {TYPE} dataStore
   * @param {?Date} [time=null]
   * @return {unknown[]}
   */
  constructor(storeID, type, dataStore, time = null) {
    time = time || new Date()
    /**
     * @type {string|Symbol}
     * @private
     */
    this.__storeID = storeID
    /**
     * @type {TYPE}
     * @private
     */
    this.__data = dataStore
    assertType(time instanceof Date, '`time` should be a `Date`')
    /**
     * @type {Date}
     * @private
     */
    this.__time = time
    /**
     * @type {TYPE.}
     * @private
     */
    this.__type = type
    return deepFreezeSeal(this)
  }

  /**
   *
   * @return {(string|Symbol)}
   */
  storeID() {
    return this.__storeID
  }

  /**
   *
   * @return {TYPE}
   */
  data() {
    return this.__data
  }

  /**
   *
   * @return {Date}
   */
  time() {
    return this.__time
  }

  /**
   *
   * @return {TYPE.}
   * @private
   */
  __type__() {
    return this.__type
  }

  /**
   *
   * @param {Class} constructor
   * @return {boolean}
   */
  isTypeOf(constructor) {
    return constructor === this.__type__()
  }

  /**
   * @returns {Object}
   */
  toJSON() {
    return {
      time: this.__time,
      data: this.__data
    }
  }

}

/**
 * @template TYPE
 */
export class StoreStateBuilder {
  constructor() {

    /**
     * @type {?string}
     * @private
     */
    this.__storeID = null
    /**
     * @type {?Class<TYPE>}
     * @private
     */
    this.__type = null
    /**
     * @type {?TYPE}
     * @private
     */
    this.__data = null
    /**
     * @type {?Date}
     * @private
     */
    this.__time = null
  }

  /**
   * @param {string} value
   * @return {StoreStateBuilder}
   */
  storeID(value) {
    this.__storeID = value
    return this
  }

  /**
   * @param {?TYPE} value
   * @return {StoreStateBuilder}
   */
  data(value) {
    this.__data = value
    return this
  }

  /**
   * @param {?Class<TYPE>} value
   * @return {StoreStateBuilder}
   */
  type(value) {
    this.__type = value
    return this
  }

  /**
   * @param {Date} value
   * @return {StoreStateBuilder}
   */
  time(value) {
    this.__time = value
    return this
  }

  /**
   * @param {string} json
   * @param {?Class<TYPE>} type
   * @return {StoreStateBuilder}
   */
  static fromJSON(json, type) {
    /**
     * @type {Object}
     */
    const jsonObject = JSON.parse(json)

    const builder = new StoreStateBuilder()

    builder.type(type)

    if (jsonObject['time'] !== undefined && !isNull(jsonObject['time'])) {
      builder.time(new Date(jsonObject['time']))
    }
    if (jsonObject['data'] !== undefined && !isNull(jsonObject['data'])) {
      builder.data(type.fromObject(jsonObject['data']).build())
    }
    return builder
  }

  build() {
    return new StoreState(
      this.__storeID,
      this.__type,
      this.__data,
      this.__time
    )
  }
}
