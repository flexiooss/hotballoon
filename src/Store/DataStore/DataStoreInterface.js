import {CoreException} from '../../CoreException'

/**
 * @interface
 */
export class DataStoreInterface {
  /**
   * @param {string} json
   * @returns {DataStoreInterface}
   */
  static fromJSON(json) {
    throw new CoreException(`static fromJSON should be override with this signature :
   /**
   * @param {string} json
   * @returns {DataStoreInterface}
   */
   `, 'METHOD_NOT_OVERRIDE')
  }
}
