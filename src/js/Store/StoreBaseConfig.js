import {StorageInterface} from './Storage/StorageInterface'
import {assertType, isSymbol, isString} from '@flexio-oss/assert'
import {StoreTypeConfig} from './StoreTypeConfig'

/**
 * @template TYPE, TYPE_BUILDER
 */
export class StoreBaseConfig {
  /**
   * @constructor
   * @param {(Symbol|String)} id
   * @param {StoreTypeConfig<TYPE, TYPE_BUILDER>} storeTypeConfig
   * @param {StorageInterface<TYPE>} storage
   */
  constructor(id, storeTypeConfig, storage) {
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
  }

  /**
   *
   * @return {(symbol|String)}
   */
  get id() {
    return this._id
  }

  /**
   *
   * @return {TYPE.}
   */
  get type() {
    return this._storeTypeConfig.type
  }

  /**
   *
   * @return {TYPE_BUILDER.}
   */
  get typeBuilder() {
    return this._storeTypeConfig.typeBuilder
  }

  /**
   *
   * @return {StoreTypeConfig~validatorClb<TYPE>}
   */
  get validator() {
    return this._storeTypeConfig.validator
  }

  /**
   *
   * @return {StoreTypeConfig~defaultCheckerClb<TYPE>}
   */
  get defaultChecker() {
    return this._storeTypeConfig.defaultChecker
  }

  /**
   *
   * @return {StorageInterface<TYPE>}
   */
  get storage() {
    return this._storage
  }
}
