/**
 * @template TYPE
 */
export class TypeParameter {
  /**
   * @param {Class.<TYPE>} type
   * @param {TypeParameter~validatorClb<TYPE>} validator
   * @param {TypeParameter~defaultCheckerClb<TYPE>} defaultChecker
   * @param {TypeParameter~fromObjectClb<TYPE>} fromObject
   */
  constructor(
    type,
    defaultChecker = (v) => {
      return v
    },
    validator = () => true, fromObject = () => {
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
   * @return {TypeParameter~validatorClb<TYPE>}
   */
  get validator() {
    return this._validator
  }

  /**
   * @template TYPE
   * @callback TypeParameter~validatorClb
   * @param {TYPE} v
   * @return {boolean}
   */

  /**
   *
   * @return {TypeParameter~defaultCheckerClb}
   */
  get defaultChecker() {
    return this._defaultChecker
  }

  /**
   * @template TYPE
   * @callback TypeParameter~defaultCheckerClb
   * @param {TYPE} v
   * @return {TYPE}
   */

  /**
   *
   * @return {TypeParameter~fromObjectClb}
   */
  get fromObject() {
    return this._fromObject
  }

  /**
   * @template TYPE
   * @callback TypeParameter~fromObjectClb
   * @param {Object} v
   * @return {TYPE}
   */
}
