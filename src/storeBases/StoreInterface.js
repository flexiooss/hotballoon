import {WithIDBase} from '../bases/WithIDBase'
import {CoreException} from '../CoreException'

export const CHANGED = 'CHANGED'

export class StoreInterface extends WithIDBase {
  /**
   * @param {String} type
   * @param {Function} callback
   * @param {Object} scope
   * @param {Integer} priority
   * @return {String} token
   */
  subscribe(type, callback, scope, priority) {
    throw new CoreException(`subscribe should be override with this signature :
   /**
   * @param {String} type
   * @param {Function} callback
   * @param {Object} scope
   * @param {Integer} priority
   * @return {String} token
   */
   `, 'METHOD_NOT_OVERRIDE')
  }
}
