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
    throw new CoreException(`storeId should be overridden with this signature :
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
    throw new CoreException(`changedEventName should be overridden with this signature :
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
    throw new CoreException(`subscribe should be overridden with this signature :
   /**
   * @param {OrderedEventListenerConfig} orderedEventListenerConfig
   * @return {String} token
   */
   `, 'METHOD_NOT_OVERRIDE')
  }

  /**
   *
   * @param {function(state: StoreState<TYPE>)} callback
   * @param {number} priority
   * @return {ListenedStore}
   */
  listenChanged(callback, priority) {
    throw new CoreException(`listenChanged should be overridden with this signature :
   /**
   * @param {StoreInterface~changedClb} clb
   * @param {number} priority
   * @return {ListenedStore} 
   */
   `, 'METHOD_NOT_OVERRIDE')
  }

  /**
   *
   * @param {(string|Symbol)} token
   */
  stopListenChanged(token) {
    throw new CoreException(`stopListenChanged should be overridden with this signature :
   /**
     * @param {(string|Symbol)} token
   */
   `, 'METHOD_NOT_OVERRIDE')
  }

  /**
   * @returns {StoreState<TYPE>} state frozen
   */
  state() {
    throw new CoreException(`state should be overridden with this signature :
   /**
   * @return {State} state frozen
   */
   `, 'METHOD_NOT_OVERRIDE')
  }

  /**
   *
   * @return {TYPE.}
   */
  __type__() {
    throw new CoreException(`__type__ should be overridden with this signature :
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
    throw new CoreException(`isTypeOf should be overridden with this signature :
   /**
   * @param {Class} constructor
   * @return {boolean}
   */
   `, 'METHOD_NOT_OVERRIDE')
  }

}
