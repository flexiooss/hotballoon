import {CoreException} from '../CoreException'

export const STORE_CHANGED = '__HB__.STORE.CHANGED'

/**
 * @interface
 * @extends WithID
 * @implements {GenericType<TYPE>}
 * @template TYPE, TYPE_BUILDER
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
   * @param {OrderedEventListenerConfig} orderedEventListenerConfig
   * @return {String} token
   */
  subscribe(orderedEventListenerConfig) {
    throw new CoreException(`subscribe should be override with this signature :
   /**
   * @param {OrderedEventListenerConfig} orderedEventListenerConfig
   * @return {String} token
   */
   `, 'METHOD_NOT_OVERRIDE')
  }

  /**
   *
   * @param {StoreInterface~changedClb<TYPE>} clb
   * @param {number} priority
   * @return {string} token
   */
  listenChanged(clb, priority) {
    throw new CoreException(`listenChanged should be override with this signature :
   /**
   * @param {StoreInterface~changedClb} clb
   * @param {number} priority
   * @return {string} token
   */
   `, 'METHOD_NOT_OVERRIDE')
  }

  /**
   *
   * @param {(string|Symbol)} token
   */
  stopListenChanged(token) {
    throw new CoreException(`listenChanged should be override with this signature :
   /**
     * @param {(string|Symbol)} token
   */
   `, 'METHOD_NOT_OVERRIDE')
  }

  /**
   *
   * @callback StoreInterface~changedClb
   * @param {StoreState<TYPE>} state
   * @template TYPE
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

  /**
   *
   * @return {TYPE.}
   */
  get __type__() {
    throw new CoreException(`state should be override with this signature :
   /**
   * @return {TYPE.}
   */
   `, 'METHOD_NOT_OVERRIDE')
  }

  /**
   *
   * @param {Class} constructor
   * @return {boolean}
   */
  isTypeOf(constructor) {
    throw new CoreException(`state should be override with this signature :
   /**
   * @param {Class} constructor
   * @return {boolean}
   */
   `, 'METHOD_NOT_OVERRIDE')
  }

}
