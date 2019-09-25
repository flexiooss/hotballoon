import {assertType, isClass, isFunction} from '@flexio-oss/assert'

/**
 * @template TYPE, TYPE_BUILDER
 */
export class StoreTypeConfig {
  /**
   * @param {TYPE.} type
   * @param {StoreTypeConfig~defaultCheckerClb<TYPE>} [defaultChecker= v=>v]
   * @param {StoreTypeConfig~validatorClb<TYPE>} [validator= ()=>true]
   */
  constructor(
    type,
    defaultChecker = v => v,
    validator = () => true,
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

    assertType(
      isFunction(validator),
      'hotballoon:StoreTypeConfig:constructor: `validator` argument should be a Function'
    )
    /**
     *
     * @type {StoreTypeConfig~validatorClb<TYPE>}
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
  get type() {
    return this._type
  }

  /**
   *
   * @return {StoreTypeConfig~validatorClb<TYPE>}
   */
  get validator() {
    return this._validator
  }

  /**
   * @template TYPE
   * @callback StoreTypeConfig~validatorClb
   * @param {TYPE} v
   * @return {boolean}
   */

  /**
   *
   * @return {StoreTypeConfig~defaultCheckerClb}
   */
  get defaultChecker() {
    return this._defaultChecker
  }

  /**
   * @template TYPE
   * @callback StoreTypeConfig~defaultCheckerClb
   * @param {TYPE} v
   * @return {TYPE}
   */

}
