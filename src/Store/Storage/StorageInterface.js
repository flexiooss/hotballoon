'use strict'
import {CoreException} from '../../CoreException'

/**
 * @class
 * @interface
 */
export class StorageInterface {
  /**
   * @param {string|Symbol} storeId
   * @param {DataStoreInterface} data
   * @returns {StorageInterface}
   */
  set(storeId, data) {
    throw new CoreException(`set should be override`, 'METHOD_NOT_OVERRIDE')
  }

  /**
   * @returns {State}
   */
  get() {
    throw new CoreException(`get should be override`, 'METHOD_NOT_OVERRIDE')
  }

  /**
   * @returns {State} state cloned
   */
  clone() {
    throw new CoreException(`clone should be override `, 'METHOD_NOT_OVERRIDE')
  }
}
