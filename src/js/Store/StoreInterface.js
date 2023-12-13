import {NotOverrideException} from '@flexio-oss/js-commons-bundle/assert/index.js';
import {listenableInterface} from "./Listenable.js";


export const STORE_CHANGED = '__HB__.STORE.CHANGED'
export const STORE_REMOVED = '__HB__.STORE.REMOVED'


/**
 * @interface
 * @extends WithID
 * @implements {GenericType<TYPE>}
 * @implements {Listenable<TYPE>}
 * @template TYPE, TYPE_BUILDER
 */
export class StoreInterface extends listenableInterface(){
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
   * @param {OrderedEventListenerConfig|function(StoreEventListenerConfigBuilder<TYPE>):OrderedEventListenerConfig} orderedEventListenerConfig
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
   * @param {(string|Symbol)} token
   */
  stopListenChanged(token) {
    NotOverrideException.FROM_INTERFACE('StoreInterface')
  }

  /**
   * @param {OrderedEventListenerConfig|function(StoreEventListenerConfigBuilder<TYPE>):OrderedEventListenerConfig} orderedEventListenerConfig
   * @return {ListenedStore}
   */
  listenRemoved(orderedEventListenerConfig) {
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

}
