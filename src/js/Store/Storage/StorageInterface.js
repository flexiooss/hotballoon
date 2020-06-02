'use strict'
import {CoreException} from '../../CoreException'

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
    throw new CoreException(`set should be override`, 'METHOD_NOT_OVERRIDE')
  }

  /**
   * @returns {?StoreState<TYPE>}
   */
  get() {
    throw new CoreException(`get should be override`, 'METHOD_NOT_OVERRIDE')
  }
}
