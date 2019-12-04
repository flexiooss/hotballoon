/**
 * @template TYPE
 * @interface
 */
export class GenericType {
  /**
   *
   * @return {Class<TYPE>}
   */
  __type__() {
    throw new Error('not implemented')
  }

  /**
   *
   * @param {Class} constructor
   * @return {boolean}
   */
  isTypeOf(constructor) {
    throw new Error('not implemented')
  }
}
