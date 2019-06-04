import {CLASS_TAG_NAME, CLASS_TAG_NAME_PUBLIC_STORE_HANDLER} from '../HasTagClassNameInterface'
import {assertType, isFunction} from '@flexio-oss/assert'

const _store = Symbol('_store')

/**
 *
 * @implements {StoreInterface<TYPE>}
 * @implements  {HasTagClassNameInterface}
 * @implements {GenericType<TYPE>}
 * @template TYPE
 */
export class PublicStoreHandler {
  /**
   *
   * @template TYPE
   * @param {StoreInterface<TYPE>} store
   */
  constructor(store) {
    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_PUBLIC_STORE_HANDLER
    })

    /**
     * @params {StoreInterface<TYPE>}
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
   * @param {EventListenerOrderedParam} eventListenerOrderedParam
   * @return {String} token
   */
  subscribe(eventListenerOrderedParam) {
    return this[_store].subscribe(eventListenerOrderedParam)
  }

  /**
   *
   * @return {Class<TYPE>}
   */
  get __type__() {
    return this[_store].type()
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
   * @param {StoreBase~changedClb} clb
   * @return {string} token
   */
  listenChanged(clb = (state) => true) {
    assertType(
      isFunction(clb),
      'hotballoon:' + this.constructor.name + ':listenChanged: `clb` argument should be callable'
    )

    return this[_store].listenChanged(clb)
  }

}
