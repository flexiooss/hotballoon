import {CoreException} from '../CoreException'
import {assertType, isFunction} from '@flexio-oss/assert'
import {EventListenerOrderedBuilder} from '../../..'

export const STORE_CHANGED = '__HB__.STORE.CHANGED'

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
   *
   * @return {string}
   */
  changedEventName() {
    throw new CoreException(`changedEventName should be override with this signature :
   /**
   *@return {string}
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
   *
   * @param {StoreInterface~changedClb} clb
   * @return {string} token
   */
  listenChanged(clb) {
    throw new CoreException(`listenChanged should be override with this signature :
   /**
   * @param {StoreInterface~changedClb} clb
   * @return {string} token
   */
   `, 'METHOD_NOT_OVERRIDE')
  }

  /**
   *
   * @callback StoreInterface~changedClb
   * @param {StoreState} state
   */

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
