import {assertType, isFunction, isClass} from '@flexio-oss/assert'

/**
 * @template TYPE, TYPE_BUILDER
 */
export class ActionTypeConfig {
  /**
   * @param {TYPE.} type
   * @param {TYPE_BUILDER.} typeBuilder
   * @param {ActionTypeConfig~defaultCheckerClb<TYPE>} [defaultChecker=data=>data]
   * @param {ActionTypeConfig~validatorClb<TYPE>} [validator=data=>true]
   */
  constructor(
    type,
    typeBuilder,
    defaultChecker = data => data,
    validator = data => true
  ) {
    assertType(isClass(type), 'hotballoon:ActionTypeConfig:constructor "type" argument should be a Class')
    assertType(isClass(typeBuilder), 'hotballoon:ActionTypeConfig:constructor "typeBuilder" argument should be a Class')
    assertType(isFunction(validator), 'hotballoon:ActionTypeConfig:constructor "validator" argument should be function')
    assertType(isFunction(defaultChecker), 'hotballoon:ActionTypeConfig:constructor "defaultChecker" argument should be function')

    this._type = type
    this._typeBuilder = typeBuilder
    this._validator = validator
    this._defaultChecker = defaultChecker
  }

  /**
   *
   * @return {TYPE.}
   */
  get type() {
    return this._type
  }

  /**
   *
   * @return {TYPE_BUILDER.}
   */
  get typeBuilder() {
    return this._typeBuilder
  }

  /**
   *
   * @return {ActionTypeConfig~validatorClb<TYPE>}
   */
  get validator() {
    return this._validator
  }

  /**
   * @template TYPE
   * @callback ActionTypeConfig~validatorClb
   * @param {TYPE} data
   * @return {boolean}
   */

  /**
   *
   * @return {ActionTypeConfig~defaultCheckerClb<TYPE>}
   */
  get defaultChecker() {
    return this._defaultChecker
  }

  /**
   * @template TYPE
   * @callback ActionTypeConfig~defaultCheckerClb
   * @param {TYPE} data
   * @return {TYPE}
   */
}
