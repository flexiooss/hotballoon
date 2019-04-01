import {assertType, isFunction, isObject} from 'flexio-jshelpers'

/**
 * @template TYPE
 */
export class ActionTypeParam {
  /**
   * @param {Class<TYPE>} type
   * @param {ActionTypeParam~defaultCheckerClb<TYPE>} defaultChecker
   * @param {ActionTypeParam~validatorClb<TYPE>} validator
   */
  constructor(
    type,
    defaultChecker = (data) => {
      return data
    },
    validator = (data) => true
  ) {
    // TODO isClass
    // console.log(type)
    // console.dir(type)
    // assertType(isObject(type), 'hotballoon:ActionTypeParam:constructor "type" argument should be Object')
    assertType(isFunction(validator), 'hotballoon:ActionTypeParam:constructor "validator" argument should be function')
    assertType(isFunction(defaultChecker), 'hotballoon:ActionTypeParam:constructor "defaultChecker" argument should be function')

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
   * @return {ActionTypeParam~validatorClb<TYPE>}
   */
  get validator() {
    return this._validator
  }

  /**
   * @template TYPE
   * @callback ActionTypeParam~validatorClb
   * @param {TYPE} data
   * @return {boolean}
   */

  /**
   *
   * @return {ActionTypeParam~defaultCheckerClb<TYPE>}
   */
  get defaultChecker() {
    return this._defaultChecker
  }

  /**
   * @template TYPE
   * @callback ActionTypeParam~defaultCheckerClb
   * @param {TYPE} data
   * @return {TYPE}
   */
}
