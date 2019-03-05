import {CoreException} from '../../CoreException'

/**
 * @interface
 */
export class StoreHandlerInterface {
  /**
   * @return {State}
   */
  state() {
    throw new CoreException(`state should be override with this signature :
   /**
   * @return {State}
   */
   `, 'METHOD_NOT_OVERRIDE')
  }

  /**
   * @param {EventListenerOrderedParam} eventListenerOrderedParam
   * @return {String} token
   */
  subscribe(eventListenerOrderedParam) {
    throw new CoreException(`subscribe should be override with this signature :
   /**L
   * @return {any} data init
   */
   `, 'METHOD_NOT_OVERRIDE')
  }

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
}
