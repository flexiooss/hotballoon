import {StoreInterface} from '../Store/StoreInterface'
import {assert} from 'flexio-jshelpers'

const _Stores = Symbol('_Stores')

export class ViewStoresParameters {
  constructor() {
    const _MapOfStores = new Map()

    Object.defineProperties(this, {
      [_Stores]: {
        configurable: false,
        enumerable: true,
        writable: false,
        /**
         * @property {Map<StoreInterface>}
         * @name ViewStoresParameters#_Stores
         * @private
         */
        value: _MapOfStores
      }
    })
  }

  /**
   *
   * @return {Map<string, StoreInterface>}
   */
  getMap() {
    return this[_Stores]
  }

  /**
   *
   * @param {string} key
   * @param {StoreInterface} store
   * @return {ViewContainerBase}
   */
  setStore(key, store) {
    assert(store instanceof StoreInterface,
      `hotballoon:${this.constructor.name}:setStore: \`store\` argument should be an instance of StoreInterface %s given`,
      Object.getPrototypeOf(store).constructor.name
    )
    this[_Stores].set(key, store)
    return this
  }
}
