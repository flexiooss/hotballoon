import {assertType, isFunction, isClass, isNull} from '@flexio-oss/assert'
import {TypeCheck} from '@flexio-oss/js-validator-helper'

/**
 * @template TYPE, TYPE_BUILDER
 */
export class ActionTypeConfig {
  /**
   * @param {TYPE.} type
   * @param {ActionTypeConfig~defaultCheckerClb<TYPE>} [defaultChecker=data=>data]
   * @param {?ValueObjectValidator} [validator=null]
   */
  constructor(
    type,
    defaultChecker = data => data,
    validator = null
  ) {
    assertType(isClass(type), 'hotballoon:ActionTypeConfig:constructor "type" argument should be a Class')
    assertType(isNull(validator) || TypeCheck.isValueObjectValidator(validator), 'hotballoon:ActionTypeConfig:constructor "validator" argument should be ValueObjectValidator or null')
    assertType(isFunction(defaultChecker), 'hotballoon:ActionTypeConfig:constructor "defaultChecker" argument should be function')

    /**
     *
     * @type {TYPE}
     * @private
     */
    this._type = type
    /**
     *
     * @type {?ValueObjectValidator}
     * @private
     */
    this._validator = validator
    /**
     *
     * @type {ActionTypeConfig~defaultCheckerClb<TYPE>}
     * @private
     */
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
   * @return {?ValueObjectValidator}
   */
  get validator() {
    return this._validator
  }

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
