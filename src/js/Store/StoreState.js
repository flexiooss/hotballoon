import {deepFreezeSeal} from '@flexio-oss/js-commons-bundle/js-generator-helpers'
import {assertType, isNull} from '@flexio-oss/js-commons-bundle/assert'

/**
 * @implements {GenericType<TYPE>}
 * @template TYPE
 */
export class StoreState {
  /**
   * @type {string|Symbol}
   */
  #storeID
  /**
   * @type {TYPE}
   */
  #data
  /**
   * @type {Date}
   */
  #time
  /**
   * @type {?TYPE.}
   */
  #type

  /**
   * @param {(string|Symbol)} storeID
   * @param {?TYPE.} type
   * @param {TYPE} dataStore
   * @param {?Date} [time=null]
   * @return {unknown[]}
   */
  constructor(storeID, type, dataStore, time = null) {
    this.#storeID = storeID
    this.#data = dataStore

    time = time || new Date()
    assertType(time instanceof Date, '`time` should be a `Date`')
    this.#time = time
    this.#type = type
    return deepFreezeSeal(this)
  }

  /**
   * @return {(string|Symbol)}
   */
  storeID() {
    return this.#storeID
  }

  /**
   * @return {TYPE}
   */
  data() {
    return this.#data
  }

  /**
   * @return {Date}
   */
  time() {
    return this.#time
  }

  /**
   * @return {?TYPE.}
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
   * @returns {Object}
   */
  toJSON() {
    return {
      time: this.#time,
      data: this.#data
    }
  }

}

/**
 * @template TYPE
 */
export class StoreStateBuilder {

  /**
   * @type {?string}
   */
  #storeID = null
  /**
   * @type {?TYPE.}
   */
  #type = null
  /**
   * @type {?TYPE}
   */
  #data = null
  /**
   * @type {?Date}
   */
  #time = null

  /**
   * @param {string} value
   * @return {StoreStateBuilder}
   */
  storeID(value) {
    this.#storeID = value
    return this
  }

  /**
   * @param {?TYPE} value
   * @return {StoreStateBuilder}
   */
  data(value) {
    this.#data = value
    return this
  }

  /**
   * @param {?Class<TYPE>} value
   * @return {StoreStateBuilder}
   */
  type(value) {
    this.#type = value
    return this
  }

  /**
   * @param {Date} value
   * @return {StoreStateBuilder}
   */
  time(value) {
    this.#time = value
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
      this.#storeID,
      this.#type,
      this.#data,
      this.#time
    )
  }
}
