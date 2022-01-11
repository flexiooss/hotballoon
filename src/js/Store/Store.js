import {CLASS_TAG_NAME, CLASS_TAG_NAME_STORE} from '../Types/HasTagClassNameInterface'
import {StoreInterface} from './StoreInterface'
import {StoreBase} from './StoreBase'
import {RemovedException} from "../Exception/RemovedException";

export const STORE_INIT = Symbol('STORE.INIT')

/**
 * @template TYPE, TYPE_BUILDER
 * @extends {StoreBase<TYPE, TYPE_BUILDER>}
 * @implements {StoreInterface<TYPE, TYPE_BUILDER>}
 * @implements {GenericType<TYPE>}
 * @implements  {HasTagClassNameInterface}
 */
export class Store extends StoreBase {
  /**
   * @constructor
   * @param {StoreConfig<TYPE, TYPE_BUILDER>} storeConfig
   */
  constructor(storeConfig) {
    super(storeConfig)

    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_STORE
    })

    this._dispatch(STORE_INIT)
  }

}
