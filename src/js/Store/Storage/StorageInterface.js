import {NotOverrideException} from '@flexio-oss/js-commons-bundle/assert'

/**
 * @class
 * @interface
 * @template TYPE
 */
export class StorageInterface {
  /**
   * @param {string|Symbol} storeId
   * @param {TYPE} data
   * @returns {StorageInterface<TYPE>}
   */
  set(storeId, data) {
    throw NotOverrideException.FROM_INTERFACE('StorageInterface')
  }

  /**
   * @returns {?StoreState<TYPE>}
   */
  get() {
    throw NotOverrideException.FROM_INTERFACE('StorageInterface')
  }
}
