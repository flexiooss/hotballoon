import {Store} from './Store.js'

/**
 * @template TYPE, TYPE_BUILDER
 * @extends {Store<TYPE, TYPE_BUILDER>}
 * @implements {StoreInterface<TYPE, TYPE_BUILDER>}
 * @implements {GenericType<TYPE>}
 * @implements  {HasTagClassNameInterface}
 */
export class OnDemandStore extends Store {
  /**
   * @type {function(state: TYPE ):TYPE}
   */
  #mapper

  /**
   * @constructor
   * @param {OnDemandStoreConfig<TYPE, TYPE_BUILDER>} storeConfig
   */
  constructor(storeConfig) {
    super(storeConfig)
    this.#mapper = storeConfig.mapper()
  }

  /**
   * @returns {StoreState<TYPE>} state frozen
   */
  state() {
    return this._storage().set(
      this.ID(),
      this.validateDataStore(this.#mapper.call(null, super.state(),this,true)
      )
    )
  }
}
