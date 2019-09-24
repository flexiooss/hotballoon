import {CLASS_TAG_NAME, CLASS_TAG_NAME_PUBLIC_STORE_HANDLER} from '../Types/HasTagClassNameInterface'
import {assertType, isFunction} from '@flexio-oss/assert'

const _store = Symbol('_store')

/**
 *
 * @implements {StoreInterface<TYPE, TYPE_BUILDER>}
 * @implements  {HasTagClassNameInterface}
 * @implements {GenericType<TYPE>}
 * @template TYPE, TYPE_BUILDER
 */
export class PublicStoreHandler {
  /**
   *
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
    this[_store] = store
  }

  /**
   * @returns {StoreState<TYPE>} state frozen
   */
  state() {
    return this[_store].state()
  }

  /**
   * @return {TYPE} state#data
   */
  data() {
    return this.state().data
  }

  /**
   *
   * @return {(string|symbol)}
   */
  storeId() {
    return this[_store].storeId()
  }

  /**
   * @param {OrderedEventListenerConfig} orderedEventListenerConfig
   * @return {String} token
   */
  subscribe(orderedEventListenerConfig) {
    return this[_store].subscribe(orderedEventListenerConfig)
  }

  /**
   *
   * @return {TYPE.}
   */
  get __type__() {
    return this[_store].type()
  }

  /**
   *
   * @return {TYPE_BUILDER.}
   */
  typeBuilder() {
    return this[_store].typeBuilder()

  }

  /**
   *
   * @param {Class} constructor
   * @return {boolean}
   */
  isTypeOf(constructor) {
    return this[_store].isTypeOf(constructor)
  }

  /**
   *
   * @param {StoreInterface~changedClb<TYPE>} clb
   * @param {number} [priority=100]
   * @return {string} token
   */
  listenChanged(clb, priority = 100) {
    return this[_store].listenChanged(clb, priority)
  }

  /**
   *
   * @param {(string|Symbol)} token
   */
  stopListenChanged(token) {
    return this[_store].stopListenChanged(token)
  }

}
