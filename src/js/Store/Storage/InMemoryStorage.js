import {assertInstanceOf, isNull, TypeCheck} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {deepFreezeSeal} from '@flexio-oss/js-commons-bundle/js-generator-helpers/index.js'
import {StoreState} from '../StoreState.js'
import {StorageInterface} from './StorageInterface.js'


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
   * @type {?TYPE.}
   */
  #type

  /**
   * @constructor
   * @param {?TYPE.} type
   * @param {StoreState<TYPE>} state
   */
  constructor(type, state) {
    super()
    this.#state = assertInstanceOf(state, StoreState, 'StoreState')
    this.#type = TypeCheck.assertIsClassOrNull(type)
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
   * @return {?TYPE.}
   */
  __type__() {
    return this.#type
  }

  /**
   * @param {Class} constructor
   * @return {boolean}
   */
  isTypeOf(constructor) {
    if (isNull(this.__type__())) {
      return isNull(constructor)
    }
    return constructor === this.__type__()
  }

  /**
   * @param {string|Symbol} storeId
   */
  clean(storeId) {
    return this.remove(storeId);
  }

  /**
   * @param {string|Symbol} storeId
   */
  remove(storeId) {
    return this.set(storeId, null)
  }
}
