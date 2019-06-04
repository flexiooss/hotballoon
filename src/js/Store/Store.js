import {CLASS_TAG_NAME, CLASS_TAG_NAME_STORE} from '../HasTagClassNameInterface'
import {StoreInterface} from './StoreInterface'

import {StoreBase, _set, _dispatch} from './StoreBase'

export const STORE_INIT = Symbol('STORE.INIT')

/**
 * @template TYPE
 * @extends {StoreBase<TYPE>}
 * @implements {StoreInterface<TYPE>}
 * @implements {GenericType<TYPE>}
 * @implements  {HasTagClassNameInterface}
 */
export class Store extends StoreBase {
  /**
   * @constructor
   * @param {StoreParams} storeParams
   */
  constructor(storeParams) {
    super(storeParams)

    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_STORE
    })

    this[_dispatch](STORE_INIT)
  }

  /**
   *
   * @param {TYPE} dataStore
   */
  set(dataStore) {
    this[_set](dataStore)
  }
}
