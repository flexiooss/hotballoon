import {CLASS_TAG_NAME, CLASS_TAG_NAME_PUBLIC_STORE_HANDLER} from '../HasTagClassNameInterface'

const _store = Symbol('_store')

/**
 *
 * @implements {StoreInterface}
 * @implements {HasTagClassNameInterface}
 * @template TYPE
 */
export class PublicStoreHandler {
  /**
   *
   * @param {StoreInterface} store
   */
  constructor(store) {
    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_PUBLIC_STORE_HANDLER
    })

    /**
     * @type {StoreInterface}
     */
    this[_store] = store
  }

  /**
   * @return {TYPE} state#data
   */
  data() {
    return this[_store].state().data
  }

  /**
   *
   * @return {(string|symbol)}
   */
  storeId() {
    return this[_store].storeId()
  }

  /**
   * @param {EventListenerOrderedParam} eventListenerOrderedParam
   * @return {String} token
   */
  subscribe(eventListenerOrderedParam) {
    return this[_store].subscribe(eventListenerOrderedParam)
  }

  /**
   * @returns {!State<TYPE>} state frozen
   */
  state() {
    return this[_store].state()
  }

  /**
   *
   * @return {Class.<TYPE>}
   */
  type() {
    return this[_store].type()
  }

  /**
   *
   * @param {Class} constructor
   * @return {boolean}
   */
  isStoreOf(constructor) {
    return this[_store].isStoreOf(constructor)
  }
}
