import {NotOverrideException} from '@flexio-oss/js-commons-bundle/assert'

/**
 * @template TYPE
 * @interface
 */
export class GenericType {
  /**
   * @return {Class<TYPE>}
   */
  __type__() {
    throw NotOverrideException.FROM_INTERFACE('GenericType')
  }

  /**
   * @param {Class} constructor
   * @return {boolean}
   */
  isTypeOf(constructor) {
    throw NotOverrideException.FROM_INTERFACE('GenericType')
  }
}
