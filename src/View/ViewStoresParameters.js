import {TypeCheck} from '../TypeCheck'

export class ViewStoresParameters {
  /**
   *
   * @param {StoreInterface} store
   * @return {StoreInterface}
   */
  validate(store) {
    if (TypeCheck.isStoreBase(store)) {
      return store
    }
    throw TypeError('store argument should be an instance of StoreInterface')
  }
}
