import {assertType, isClass, isNull,TypeCheck as TypeTypeCheck} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {TypeCheck} from '@flexio-oss/js-commons-bundle/js-validator-helper/index.js'


/**
 *
 * @template TYPE
 * @template TYPE_BUILDER
 */
export class ActionTypeConfig {
  /**
   * @param {?Class<TYPE>} type
   * @param {function(data:TYPE):TYPE} [defaultChecker=data=>data]
   * @param {?ValueObjectValidator} [validator=null]
   */
  constructor(
    type,
    defaultChecker = data => data,
    validator = null
  ) {

    assertType(isNull(type) || isClass(type), 'hotballoon:ActionTypeConfig:constructor "type" argument should be a Class')
    assertType(isNull(validator) || TypeCheck.isValueObjectValidator(validator), 'hotballoon:ActionTypeConfig:constructor "validator" argument should be ValueObjectValidator or null')

    /**
     * @type {?Class<TYPE>}
     * @private
     */
    this._type = type
    /**
     * @type {?ValueObjectValidator}
     * @private
     */
    this._validator = validator
    /**
     * @type {function(data:TYPE):TYPE}
     * @private
     */
    this._defaultChecker = TypeTypeCheck.assertIsFunction(defaultChecker)
  }

  /**
   * @return {?Class<TYPE>}
   */
  type() {
    return this._type
  }

  /**
   * @return {?ValueObjectValidator}
   */
  validator() {
    return this._validator
  }

  /**
   * @return {function(data:TYPE):TYPE}
   */
  defaultChecker() {
    return this._defaultChecker
  }

}
