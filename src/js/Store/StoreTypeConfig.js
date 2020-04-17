import {assertType, isClass, isFunction, isNull} from '@flexio-oss/js-commons-bundle/assert'
import {TypeCheck} from '@flexio-oss/js-commons-bundle/js-validator-helper'

/**
 * @template TYPE, TYPE_BUILDER
 */
export class StoreTypeConfig {
  /**
   * @param {TYPE.} type
   * @param {StoreTypeConfig~defaultCheckerClb<TYPE>} [defaultChecker= v=>v]
   * @param {?ValueObjectValidator} [validator=null]
   */
  constructor(
    type,
    defaultChecker = v => v,
    validator = null
  ) {
    assertType(
      isClass(type),
      'hotballoon:StoreTypeConfig:constructor: `type` argument should be a Class'
    )
    /**
     *
     * @type {TYPE}
     * @protected
     */
    this._type = type

    assertType(isNull(validator) || TypeCheck.isValueObjectValidator(validator), 'hotballoon:ActionTypeConfig:constructor "validator" argument should be ValueObjectValidator or null')
    /**
     *
     * @type {?ValueObjectValidator}
     * @protected
     */
    this._validator = validator

    assertType(
      isFunction(defaultChecker),
      'hotballoon:StoreTypeConfig:constructor: `defaultChecker` argument should be a Function'
    )
    /**
     *
     * @type {StoreTypeConfig~defaultCheckerClb<TYPE>}
     * @private
     */
    this._defaultChecker = defaultChecker
  }

  /**
   *
   * @return {TYPE.}
   */
  type() {
    return this._type
  }

  /**
   *
   * @return {?ValueObjectValidator}
   */
  validator() {
    return this._validator
  }

  /**
   *
   * @return {StoreTypeConfig~defaultCheckerClb}
   */
  defaultChecker() {
    return this._defaultChecker
  }
}
