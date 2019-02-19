import {StoreInterface} from '../Store/StoreInterface'
import {assert} from 'flexio-jshelpers'

export class ViewStoresParameters {
  /**
   *
   * @param {StoreInterface} store
   * @return {StoreInterface}
   */
  validate(store) {
    console.log(store)
    assert(store instanceof StoreInterface,
      `hotballoon:${this.constructor.name}:setStore: \`store\` argument should be an instance of StoreInterface %s given`,
      store.constructor.name
    )
    return store
  }
}
