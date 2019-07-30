import {assertType, isFunction, isClass} from '@flexio-oss/assert'

/**
 * @template TYPE
 */
export class ActionTypeConfig {
  /**
   * @param {Class<TYPE>} type
   * @param {ActionTypeConfig~defaultCheckerClb<TYPE>} defaultChecker
   * @param {ActionTypeConfig~validatorClb<TYPE>} validator
   */
  constructor(
    type,
    defaultChecker = (data) => {
      return data
    },
    validator = (data) => true
  ) {
    assertType(isClass(type), 'hotballoon:ActionTypeConfig:constructor "type" argument should be a Class')
    assertType(isFunction(validator), 'hotballoon:ActionTypeConfig:constructor "validator" argument should be function')
    assertType(isFunction(defaultChecker), 'hotballoon:ActionTypeConfig:constructor "defaultChecker" argument should be function')

    this._type = type
    this._validator = validator
    this._defaultChecker = defaultChecker
  }

  /**
   *
   * @return {Class<TYPE>}
   */
  get type() {
    return this._type
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
