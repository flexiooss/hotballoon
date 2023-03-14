import {NotOverrideException} from '@flexio-oss/js-commons-bundle/assert/index.js'

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
  /**
   * @param {string|Symbol} storeId
   */
  clean(storeId){
    throw NotOverrideException.FROM_INTERFACE('StorageInterface')
  }
  /**
   * @param {string|Symbol} storeId
   */
  remove(storeId){
    throw NotOverrideException.FROM_INTERFACE('StorageInterface')
  }
}
