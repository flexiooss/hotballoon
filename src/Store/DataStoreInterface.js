import {CoreException} from '../CoreException'

/**
 * @interface
 */
export class DataStoreInterface {
  /**
   * @return {any} data init
   */
  model() {
    throw new CoreException(`model should be override with this signature :
   /**
   * @return {any} data init
   */
   `, 'METHOD_NOT_OVERRIDE')
  }
}
