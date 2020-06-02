import {deepFreezeSeal} from '@flexio-oss/js-commons-bundle/js-generator-helpers'
import {assertType} from '@flexio-oss/js-commons-bundle/assert/src/js/assert'

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
    this.__time = time || new Date()
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
      storeID: this.__storeID,
      time: this.__time,
      data: this.__data,
      type: this.__type.constructor.name
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
   * @param {?Class<TYPE>} value
   * @return {StoreStateBuilder}
   */
  type(value) {
    this.__type = value
    return this
  }

  /**
   * @param {string} json
   * @return {StoreStateBuilder}
   */
  static fromJSON(json) {
    /**
     * @type {Object}
     */
    const jsonObject = JSON.parse(json)

    const builder = new StoreStateBuilder()

    if(    jsonObject['storeID'] !== undefined && !isNull( jsonObject['storeID'])){
      this.__storeID = jsonObject['storeID']
    }
    if(    jsonObject['time'] !== undefined && !isNull( jsonObject['time'])){
      this.__time = Date.parse(jsonObject['time'])
    }
    if(    jsonObject['type'] !== undefined && !isNull( jsonObject['type'])){
      if(isNull(this.__type)){
        throw new Error('should have `type` property')
      }
      if(this.__type.constructor.name !== jsonObject['type']){
        throw new Error('`type` mismatch')
      }

    }
    if(    jsonObject['data'] !== undefined && !isNull( jsonObject['data'])){
      this.__data = this.__type.fromOject(jsonObject['data']).build()
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
