import {assertType, isClass, isFunction, isNull, TypeCheck} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {TypeCheck as TypeCheckValidator} from '@flexio-oss/js-commons-bundle/js-validator-helper/index.js'

/**
 *
 * @callback StoreTypeConfig~defaultCheckerClb
 * @template TYPE
 * @param {TYPE} data
 * @returns {TYPE}
 */

/**
 *
 * @template TYPE
 * @template TYPE_BUILDER
 */
export class StoreTypeConfig {
  /**
   * @type {StoreTypeConfig~defaultCheckerClb<TYPE>}
   */
  #defaultChecker
  /**
   * @type {?ValueObjectValidator}
   */
  #validator
  /**
   * @type {?TYPE}
   */
  #type


  /**
   * @param {?TYPE.} type
   * @param {StoreTypeConfig~defaultCheckerClb<TYPE>} [defaultChecker= v=>v]
   * @param {?ValueObjectValidator} [validator=null]
   */
  constructor(type, defaultChecker = v => v, validator = null) {
    this.#type = TypeCheck.assertIsClassOrNull(type)
    assertType(isNull(validator) || TypeCheckValidator.isValueObjectValidator(validator), 'hotballoon:ActionTypeConfig:constructor "validator" argument should be ValueObjectValidator or null')
    this.#validator = validator
    this.#defaultChecker = TypeCheck.assertIsArrowFunction(defaultChecker)
  }

  /**
   * @return {TYPE.}
   */
  type() {
    return this.#type
  }

  /**
   * @return {?ValueObjectValidator}
   */
  validator() {
    return this.#validator
  }

  /**
   * @return {StoreTypeConfig~defaultCheckerClb}
   */
  defaultChecker() {
    return this.#defaultChecker
  }
}
