import {StoreInterface} from './StoreInterface'
import {Store} from './Store'
import {SingleStateException} from "./SingleStateException";


/**
 * @template TYPE, TYPE_BUILDER
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
