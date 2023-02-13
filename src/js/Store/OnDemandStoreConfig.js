import {StoreBaseConfig} from './StoreBaseConfig.js'
import {TypeCheck as TypeTypeCheck} from '@flexio-oss/js-commons-bundle/assert/index.js'

/**
 * @template  TYPE, TYPE_BUILDER
 */
export class OnDemandStoreConfig extends StoreBaseConfig {
  /**
   * @param {(Symbol|String)} id
   * @param {TYPE} initialData
   * @param {StoreTypeConfig<TYPE, TYPE_BUILDER>} storeTypeConfig
   * @param {{function(state: TYPE ):TYPE}} mapper
   * @param {StorageInterface<TYPE>} storage
   */
  constructor(id, initialData,  storeTypeConfig, mapper, storage) {
    super(id, initialData, storeTypeConfig, storage)

    /**
     * @type {function(state: TYPE): TYPE}
     * @private
     */
    this._mapper = TypeTypeCheck.assertIsFunction(mapper)

  }

  /**
   * @return {function(state: TYPE ):TYPE}
   */
  mapper() {
    return this._mapper
  }
}
