import {WithIDBase} from '../bases/WithIDBase'
import {CoreException} from '../CoreException'

export const STORE_CHANGED = Symbol('STORE.CHANGED')

/**
 * @interface
 * @extends WithIDBase
 */
export class StoreInterface extends WithIDBase {
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
   * @return {State#data} state#data frozen
   */
  data() {
    throw new CoreException(`data should be override with this signature :
   /**
   * @return {State#data} state#data frozen
   */
   `, 'METHOD_NOT_OVERRIDE')
  }

  /**
   * @returns {State} state frozen
   */
  state() {
    throw new CoreException(`state should be override with this signature :
   /**
   * @return {State} state frozen
   */
   `, 'METHOD_NOT_OVERRIDE')
  }
}
