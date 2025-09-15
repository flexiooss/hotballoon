import {Store} from './Store.js'
import {SingleStateException} from "./SingleStateException.js";


/**
 *
 * @template TYPE
 * @template TYPE_BUILDER
 * @extends {Store<TYPE, TYPE_BUILDER>}
 * @implements {StoreInterface<TYPE, TYPE_BUILDER>}
 * @implements {GenericType<TYPE>}
 * @implements  {HasTagClassNameInterface}
 */
export class SingleStateStore extends Store {
  /**
   * @param {TYPE} dataStore
   * @throws {SingleStateException}
   */
  set(dataStore) {
    throw SingleStateException.FROM(this.ID())
  }
}
