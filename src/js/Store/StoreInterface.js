import {NotOverrideException} from "@flexio-oss/js-commons-bundle/assert";


export const STORE_CHANGED = '__HB__.STORE.CHANGED'
export const STORE_REMOVED = '__HB__.STORE.REMOVED'


/**
 * @interface
 * @extends WithID
 * @implements {GenericType<TYPE>}
 * @template TYPE, TYPE_BUILDER
 */
export class StoreInterface {
  /**
   * @return {(Symbol|string)}
   */
  storeId() {
    NotOverrideException.FROM_INTERFACE('StoreInterface')
  }

  /**
   * @return {string}
   */
  changedEventName() {
    NotOverrideException.FROM_INTERFACE('StoreInterface')
  }

  /**
   * @return {string}
   */
  removedEventName() {
    NotOverrideException.FROM_INTERFACE('StoreInterface')
  }

  /**
   * @param {OrderedEventListenerConfig} orderedEventListenerConfig
   * @return {String} token
   */
  subscribe(orderedEventListenerConfig) {
    NotOverrideException.FROM_INTERFACE('StoreInterface')
  }

  /**
   * @param {String} event
   * @param {String} token
   */
  unSubscribe(event, token) {
    NotOverrideException.FROM_INTERFACE('StoreInterface')
  }

  /**
   * @param {function(state: StoreState<TYPE>)} callback
   * @param {number} priority
   * @param {?function(state: StoreState<TYPE>)} [guard=null]
   * @return {ListenedStore}
   */
  listenChanged(callback, priority, guard=null) {
    NotOverrideException.FROM_INTERFACE('StoreInterface')
  }

  /**
   * @param {(string|Symbol)} token
   */
  stopListenChanged(token) {
    NotOverrideException.FROM_INTERFACE('StoreInterface')
  }

  /**
   * @param {function()} callback
   * @param {number} priority
   * @param {?function(state: StoreState<TYPE>)} [guard=null]
   * @return {ListenedStore}
   */
  listenRemoved(callback, priority, guard=null) {
    NotOverrideException.FROM_INTERFACE('StoreInterface')
  }

  /**
   * @param {(string|Symbol)} token
   */
  stopListenRemoved(token) {
    NotOverrideException.FROM_INTERFACE('StoreInterface')
  }

  /**
   * @returns {StoreState<TYPE>} state frozen
   */
  state() {
    NotOverrideException.FROM_INTERFACE('StoreInterface')
  }

  /**
   * @return {TYPE.}
   */
  __type__() {
    NotOverrideException.FROM_INTERFACE('StoreInterface')
  }

  /**
   *
   * @param {Class} constructor
   * @return {boolean}
   */
  isTypeOf(constructor) {
    NotOverrideException.FROM_INTERFACE('StoreInterface')
  }

  /**
   * @return {boolean}
   */
  isRemoving() {
    NotOverrideException.FROM_INTERFACE('StoreInterface')
  }

}
