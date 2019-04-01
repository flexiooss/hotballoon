/**
 * @template TYPE
 */
export class StoreTypeParam {
  /**
   * @param {Class<TYPE>} type
   * @param {StoreTypeParam~defaultCheckerClb<TYPE>} defaultChecker
   * @param {StoreTypeParam~validatorClb<TYPE>} validator
   * @param {StoreTypeParam~fromObjectClb<TYPE>} fromObject
   */
  constructor(
    type,
    defaultChecker = (v) => {
      return v
    },
    validator = () => true,
    fromObject = () => {
      throw new Error('Should be implemented')
    }) {
    this._type = type
    this._validator = validator
    this._defaultChecker = defaultChecker
    this._fromObject = fromObject
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
   * @return {StoreTypeParam~validatorClb<TYPE>}
   */
  get validator() {
    return this._validator
  }

  /**
   * @template TYPE
   * @callback StoreTypeParam~validatorClb
   * @param {TYPE} v
   * @return {boolean}
   */

  /**
   *
   * @return {StoreTypeParam~defaultCheckerClb}
   */
  get defaultChecker() {
    return this._defaultChecker
  }

  /**
   * @template TYPE
   * @callback StoreTypeParam~defaultCheckerClb
   * @param {TYPE} v
   * @return {TYPE}
   */

  /**
   *
   * @return {StoreTypeParam~fromObjectClb}
   */
  get fromObject() {
    return this._fromObject
  }

  /**
   * @template TYPE
   * @callback StoreTypeParam~fromObjectClb
   * @param {Object} v
   * @return {TYPE}
   */
}
