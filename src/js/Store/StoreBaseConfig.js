import {StorageInterface} from './Storage/StorageInterface'
import {assertType, isString, isSymbol} from '@flexio-oss/assert'
import {StoreTypeConfig} from './StoreTypeConfig'

/**
 * @template TYPE, TYPE_BUILDER
 */
export class StoreBaseConfig {
  /**
   * @constructor
   * @param {(Symbol|String)} id
   * @param {TYPE} initialData
   * @param {StoreTypeConfig<TYPE, TYPE_BUILDER>} storeTypeConfig
   * @param {StorageInterface<TYPE>} storage
   */
  constructor(id, initialData, storeTypeConfig, storage) {
    assertType(isSymbol(id) || isString(id),
      'hotballoon:' + this.constructor.name + ':constructor: `id` argument should be an should be a string or Symbol')
    /**
     *
     * @type {Symbol|String}
     * @protected
     */
    this._id = id

    assertType(storeTypeConfig instanceof StoreTypeConfig,
      'hotballoon:' + this.constructor.name + ':constructor: `storeTypeConfig` argument should be an instance of `StoreTypeConfig`')
    /**
     *
     * @type {StoreTypeConfig<TYPE, TYPE_BUILDER>}
     * @protected
     */
    this._storeTypeConfig = storeTypeConfig

    assertType(storage instanceof StorageInterface,
      'hotballoon:' + this.constructor.name + ':constructor: `storage` argument should be an instance of `StorageInterface`')
    /**
     *
     * @type {StorageInterface<TYPE>}
     * @protected
     */
    this._storage = storage

    this._initialData = initialData
  }

  /**
   *
   * @return {(symbol|String)}
   */
  id() {
    return this._id
  }

  /**
   *
   * @return {TYPE.}
   */
  type() {
    return this._storeTypeConfig.type()
  }

  /**
   *
   * @return {StoreTypeConfig~validatorClb<TYPE>}
   */
  validator() {
    return this._storeTypeConfig.validator()
  }

  /**
   *
   * @return {StoreTypeConfig~defaultCheckerClb<TYPE>}
   */
  defaultChecker() {
    return this._storeTypeConfig.defaultChecker()
  }

  /**
   *
   * @return {StorageInterface<TYPE>}
   */
  storage() {
    return this._storage
  }

  /**
   *
   * @returns {TYPE}
   */
  initialData() {
    return this._initialData
  }
}
