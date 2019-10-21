import {globalFlexioImport} from '@flexio-oss/global-import-registry'
import {assertType, isBoolean, isObject, assert, isNumber, isNull, isString} from '@flexio-oss/assert'
import {deepFreezeSeal} from '@flexio-oss/js-generator-helpers'
import {FlexArray} from '@flexio-oss/flex-types'

class FakeObject {
  /**
   * @param {string} prop1
   * @param {boolean} prop2
   * @param {number} prop3
   * @private
   */
  constructor(prop1, prop2, prop3) {
    /**
     * @private
     */
    this._prop1 = prop1

    /**
     * @private
     */
    this._prop2 = prop2

    /**
     * @private
     */
    this._prop3 = prop3

    deepFreezeSeal(this)
  }

  /**
   * @returns {string}
   */
  prop1() {
    return this._prop1
  }

  /**
   * @returns {boolean}
   */
  prop2() {
    return this._prop2
  }

  /**
   * @returns {number}
   */
  prop3() {
    return this._prop3
  }

  /**
   * @param {string} prop1
   * @returns {FakeObject}
   */
  withProp1(prop1) {
    let builder = FakeObjectBuilder.from(this)
    builder.prop1(prop1)
    return builder.build()
  }

  /**
   * @param {boolean} prop2
   * @returns {FakeObject}
   */
  withProp2(prop2) {
    let builder = FakeObjectBuilder.from(this)
    builder.prop2(prop2)
    return builder.build()
  }

  /**
   * @param {number} prop3
   * @returns {FakeObject}
   */
  withProp3(prop3) {
    let builder = FakeObjectBuilder.from(this)
    builder.prop3(prop3)
    return builder.build()
  }

  /**
   * @returns {FakeObjectBuilder}
   */
  static builder() {
    return new FakeObjectBuilder()
  }

  /**
   * @param {FakeObject} instance
   * @returns {FakeObjectBuilder}
   */
  static from(instance) {
    return FakeObjectBuilder.from(instance)
  }

  /**
   * @param {Object} jsonObject
   * @returns {FakeObjectBuilder}
   */
  static fromObject(jsonObject) {
    return FakeObjectBuilder.fromObject(jsonObject)
  }

  /**
   * @param {string} json
   * @returns {FakeObjectBuilder}
   */
  static fromJson(json) {
    return FakeObjectBuilder.fromJson(json)
  }

  /**
   * @returns {Object}
   */
  toObject() {
    let jsonObject = {}
    if (!isNull(this._prop1)) {
      jsonObject['prop1'] = this._prop1
    }
    if (!isNull(this._prop2)) {
      jsonObject['prop2'] = this._prop2
    }
    if (!isNull(this._prop3)) {
      jsonObject['prop3'] = this._prop3
    }
    return jsonObject
  }

  /**
   * @returns {Object}
   */
  toJSON() {
    return this.toObject()
  }
}

export {FakeObject}

class FakeObjectBuilder {
  /**
   * @constructor
   */
  constructor() {
    this._prop1 = null
    this._prop2 = null
    this._prop3 = null
  }

  /**
   * @param {?string} prop1
   * @returns {FakeObjectBuilder}
   */
  prop1(prop1) {
    if (!isNull(prop1)) {
      assertType(isString(prop1), 'prop1 should be a string')
    }
    this._prop1 = prop1
    return this
  }

  /**
   * @param {?boolean} prop2
   * @returns {FakeObjectBuilder}
   */
  prop2(prop2) {
    if (!isNull(prop2)) {
      assertType(isBoolean(prop2), 'prop2 should be a bool')
    }
    this._prop2 = prop2
    return this
  }

  /**
   * @param {?number} prop3
   * @returns {FakeObjectBuilder}
   */
  prop3(prop3) {
    if (!isNull(prop3)) {
      assertType(isNumber(prop3), 'prop3 should be a number')
    }
    this._prop3 = prop3
    return this
  }

  /**
   * @returns {FakeObject}
   */
  build() {
    return new FakeObject(this._prop1, this._prop2, this._prop3)
  }

  /**
   * @param {Object} jsonObject
   * @returns {FakeObjectBuilder}
   */
  static fromObject(jsonObject) {
    assertType(isObject(jsonObject), 'input should be an object')
    let builder = new FakeObjectBuilder()
    if (jsonObject['prop1'] !== undefined && !isNull(jsonObject['prop1'])) {
      builder.prop1(jsonObject['prop1'])
    }
    if (jsonObject['prop2'] !== undefined && !isNull(jsonObject['prop2'])) {
      builder.prop2(jsonObject['prop2'])
    }
    if (jsonObject['prop3'] !== undefined && !isNull(jsonObject['prop3'])) {
      builder.prop3(parseInt(jsonObject['prop3']))
    }
    return builder
  }

  /**
   * @param {string} json
   * @returns {FakeObjectBuilder}
   */
  static fromJson(json) {
    assertType(isString(json), 'input should be a string')
    let jsonObject = JSON.parse(json)
    return this.fromObject(jsonObject)
  }

  /**
   * @param {FakeObject} instance
   * @returns {FakeObjectBuilder}
   */
  static from(instance) {
    assertType(instance instanceof FakeObject, 'input should be an instance of FakeObject')
    let builder = new FakeObjectBuilder()
    builder.prop1(instance.prop1())
    builder.prop2(instance.prop2())
    builder.prop3(instance.prop3())
    return builder
  }
}

export {FakeObjectBuilder}
