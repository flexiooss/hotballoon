/**
 * @template TYPE
 */
export class TypeParameter {

  /**
   * @param {Class.<TYPE>} type
   * @param {validatorClb<TYPE>} validator
   * @param {defaultCheckerClb<TYPE>} defaultChecker
   * @param {fromObjectClb<TYPE>} fromObject
   */
  constructor(type, defaultChecker = (v) => {
    return v
  }, validator = () => true, fromObject = () => {
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
   * @return {validatorClb<TYPE>}
   */
  get validator() {
    return this._validator
  }

  /**
   * @template TYPE
   * @callback validatorClb
   * @param {TYPE} v
   * @return {boolean}
   */

  /**
   *
   * @return {Function}
   */
  get defaultChecker() {
    return this._defaultChecker
  }

  /**
   * @template TYPE
   * @callback defaultCheckerClb
   * @param {TYPE} v
   * @return {TYPE}
   */

  /**
   *
   * @return {Function}
   */
  get fromObject() {
    return this._fromObject
  }

  /**
   * @template TYPE
   * @callback fromObjectClb
   * @param {Object} v
   * @return {TYPE}
   */

}
