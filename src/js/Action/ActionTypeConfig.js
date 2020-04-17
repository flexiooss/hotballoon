import {assertType, isClass, isFunction, isNull} from '@flexio-oss/js-commons-bundle/assert'
import {TypeCheck} from '@flexio-oss/js-commons-bundle/js-validator-helper'


/**
 * @template TYPE, TYPE_BUILDER
 */
export class ActionTypeConfig {
  /**
   * @param {TYPE.} type
   * @param {function(data:TYPE):TYPE} [defaultChecker=data=>data]
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
     * @type {function(data:TYPE):TYPE}
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
   * @return {function(data:TYPE):TYPE}
   */
  defaultChecker() {
    return this._defaultChecker
  }

}
