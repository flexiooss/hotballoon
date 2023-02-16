import {CLASS_TAG_NAME, CLASS_TAG_NAME_PUBLIC_STORE_HANDLER} from '../Types/HasTagClassNameInterface.js'
import {TypeCheck} from '../Types/TypeCheck.js'

/**
 *
 * @implements {StoreInterface<TYPE, TYPE_BUILDER>}
 * @implements  {HasTagClassNameInterface}
 * @implements {GenericType<TYPE>}
 * @template TYPE, TYPE_BUILDER
 */
export class PublicStoreHandler {

  /**
   * @type {StoreInterface<TYPE, TYPE_BUILDER>}
   */
  #store

  /**
   * @param {StoreInterface<TYPE, TYPE_BUILDER>} store
   */
  constructor(store) {
    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_PUBLIC_STORE_HANDLER
    })

    /**
     * @params {StoreInterface<TYPE, TYPE_BUILDER>}
     */
    this.#store = TypeCheck.assertStoreBase(store)
  }

  /**
   * @return {string}
   */
  changedEventName() {
    return this.#store.changedEventName()
  }

  /**
   * @returns {StoreState<TYPE>} state frozen
   */
  state() {
    return this.#store.state()
  }

  /**
   * @return {TYPE} state#data
   */
  data() {
    return this.state().data()
  }

  /**
   * @return {(string|symbol)}
   */
  storeId() {
    return this.#store.storeId()
  }

  /**
   * @param {OrderedEventListenerConfig} orderedEventListenerConfig
   * @return {String} token
   */
  subscribe(orderedEventListenerConfig) {
    return this.#store.subscribe(orderedEventListenerConfig)
  }

  /**
   * @return {TYPE.}
   */
  __type__() {
    return this.#store.__type__()
  }

  /**
   * @param {Class} constructor
   * @return {boolean}
   */
  isTypeOf(constructor) {
    return this.#store.isTypeOf(constructor)
  }

  /**
   * @param {function(state: StoreState<TYPE>)} callback
   * @param {number} [priority=100]
   * @param {?function(state: StoreState<TYPE>)} [guard=null]
   * @return {ListenedStore}
   */
  listenChanged(callback, priority = 100,guard=null) {
    return this.#store.listenChanged(callback, priority, guard)
  }

  /**
   * @param {(string|Symbol)} token
   */
  stopListenChanged(token) {
    return this.#store.stopListenChanged(token)
  }

  /**
   * @return {boolean}
   */
  isRemoving() {
    return this.#store.isRemoving()
  }

  /**
   * @return {string}
   */
  removedEventName() {
    return this.#store.removedEventName()
  }

  /**
   * @param {function()} callback
   * @param {number} priority
   * @param {?function(state: StoreState<TYPE>)} [guard=null]
   * @return {ListenedStore}
   */
  listenRemoved(callback, priority,guard=null) {
    return this.#store.listenRemoved(callback, priority, guard)
  }

  /**
   * @param {(string|Symbol)} token
   */
  stopListenRemoved(token) {
    this.#store.stopListenRemoved(token)
  }

  /**
   * @param {String} event
   * @param {String} token
   */
  unSubscribe(event, token) {
    this.#store.unSubscribe(event, token)
  }

}
