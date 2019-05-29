import {CoreException} from '../CoreException'

export const STORE_CHANGED = Symbol.for('__HB__.STORE.CHANGED')

/**
 * @interface
 * @extends WithIDBase
 * @template TYPE
 */
export class StoreInterface {
  /**
   *
   *@return {(Symbol|string)}
   */
  storeId() {
    throw new CoreException(`storeId should be override with this signature :
   /**
   *@return {(Symbol|string)}
   */
   `, 'METHOD_NOT_OVERRIDE')
  }

  /**
   * @param {EventListenerOrderedParam} eventListenerOrderedParam
   * @return {String} token
   */
  subscribe(eventListenerOrderedParam) {
    throw new CoreException(`subscribe should be override with this signature :
   /**
   * @param {EventListenerOrderedParam} eventListenerOrderedParam
   * @return {String} token
   */
   `, 'METHOD_NOT_OVERRIDE')
  }

  /**
   * @returns {StoreState<TYPE>} state frozen
   */
  state() {
    throw new CoreException(`state should be override with this signature :
   /**
   * @return {State} state frozen
   */
   `, 'METHOD_NOT_OVERRIDE')
  }
}
