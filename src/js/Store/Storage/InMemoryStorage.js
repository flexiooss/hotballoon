import {assertInstanceOf, TypeCheck} from '@flexio-oss/js-commons-bundle/assert'
import {deepFreezeSeal} from '@flexio-oss/js-commons-bundle/js-generator-helpers'
import {StoreState} from '../StoreState'
import {StorageInterface} from './StorageInterface'


/**
 * @template TYPE
 * @implements {StorageInterface<TYPE>}
 * @implements {GenericType<TYPE>}
 * @extends {StorageInterface<TYPE>}
 */
export class InMemoryStorage extends StorageInterface {
  /**
   * @type {StoreState<TYPE>}
   */
  #state
  /**
   * @type {TYPE.}
   */
  #type

  /**
   * @constructor
   * @param {TYPE.} type
   * @param {StoreState<TYPE>} state
   */
  constructor(type, state) {
    super()
    this.#state = assertInstanceOf(state, StoreState, 'StoreState')
    this.#type = TypeCheck.assertIsClass(type)
    deepFreezeSeal(this)
  }

  /**
   *
   * @param {(string|Symbol)} storeID
   * @param {TYPE} data
   * @return {InMemoryStorage<TYPE>}
   */
  set(storeID, data) {
    return new InMemoryStorage(
      this.#type,
      new StoreState(storeID, this.#type, data)
    )
  }

  /**
   * @returns {?StoreState<TYPE>}
   */
  get() {
    return this.#state
  }

  /**
   * @return {TYPE.}
   */
  __type__() {
    return this.#type
  }

  /**
   * @param {Class} constructor
   * @return {boolean}
   */
  isTypeOf(constructor) {
    return constructor === this.__type__()
  }
}
