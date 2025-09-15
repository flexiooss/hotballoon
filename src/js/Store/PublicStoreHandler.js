import {CLASS_TAG_NAME, CLASS_TAG_NAME_PUBLIC_STORE_HANDLER} from '../Types/HasTagClassNameInterface.js'
import {TypeCheck} from '../Types/TypeCheck.js'
import {listenableInterface} from "./Listenable.js";

/**
 *
 * @template TYPE
 * @template TYPE_BUILDER
 * @implements {StoreInterface<TYPE, TYPE_BUILDER>}
 * @implements  {HasTagClassNameInterface}
 * @implements {GenericType<TYPE>}
 * @implements {Listenable<TYPE>}
 */
export class PublicStoreHandler extends listenableInterface(){

  /**
   * @type {StoreInterface<TYPE, TYPE_BUILDER>}
   */
  #store

  /**
   * @param {StoreInterface<TYPE, TYPE_BUILDER>} store
   */
  constructor(store) {
    super()
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
    return this.#store.state();
  }

  /**
   * @returns {Promise<StoreState<TYPE>>} state frozen
   */
  async asyncState() {
    return this.#store.asyncState();
  }

  /**
   * @return {TYPE} state#data
   */
  data() {
    return this.state().data()
  }

  /**
   * @return {Promise<TYPE>} state#data
   */
  async asyncData() {
    return (await this.asyncState()).data()
  }

  /**
   * @return {(string|symbol)}
   */
  storeId() {
    return this.#store.storeId()
  }

  /**
   * @param {function(StoreEventListenerConfigBuilder<TYPE>):OrderedEventListenerConfig} orderedEventListenerConfig
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
   * @param {OrderedEventListenerConfig|function(StoreEventListenerConfigBuilder<TYPE>):OrderedEventListenerConfig} orderedEventListenerConfig
   * @return {ListenedStore}
   */
  listenChanged(orderedEventListenerConfig) {
    return this.#store.listenChanged(orderedEventListenerConfig)
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
   * @param {OrderedEventListenerConfig|function(StoreEventListenerConfigBuilder<TYPE>):OrderedEventListenerConfig} orderedEventListenerConfig
   * @return {ListenedStore}
   */
  listenRemoved(orderedEventListenerConfig) {
    return this.#store.listenRemoved(orderedEventListenerConfig)
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
