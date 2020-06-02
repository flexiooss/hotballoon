import {UID} from '@flexio-oss/js-commons-bundle/js-helpers'
import {Store} from './Store'
import {StoreConfig} from './StoreConfig'
import {LocalStorageStorage} from './Storage/LocalStorageStorage'
import {StoreState} from './StoreState'
import {StoreTypeConfig} from './StoreTypeConfig'

/**
 * @template TYPE, TYPE_BUILDER
 */
export class LocalStorageStoreBuilder {
  constructor() {
    /**
     * @type {?TYPE.}
     * @private
     */
    this.__type = null

    /**
     * @type {?TYPE}
     * @private
     */
    this.__initialData = null
    /**
     * @type  {?ValueObjectValidator}
     * @private
     */
    this.__validator = null
    /**
     * @type {StoreTypeConfig~defaultCheckerClb<TYPE>}
     * @private
     */
    this.__defaultChecker = v => v
    /**
     * @type {?Window}
     * @private
     */
    this.__window = null
    /**
     * @type {?string}
     * @private
     */
    this.__key = null
  }

  /**
   *
   * @param {TYPE.} type
   * @return {InMemoryStoreBuilder}
   */
  type(type) {
    this.__type = type
    return this
  }

  /**
   *
   * @param {TYPE} initialData
   * @return {InMemoryStoreBuilder}
   */
  initialData(initialData) {
    this.__initialData = initialData
    return this
  }

  /**
   * @param {StoreTypeConfig~defaultCheckerClb<TYPE>} defaultChecker
   * @return {InMemoryStoreBuilder}
   */
  defaultChecker(defaultChecker) {
    this.__defaultChecker = defaultChecker
    return this
  }

  /**
   * @param {?ValueObjectValidator} validator
   * @return {InMemoryStoreBuilder}
   */
  validator(validator) {
    this.__validator = validator
    return this
  }

  /**
   * @param {Window} value
   * @return {LocalStorageStoreBuilder}
   */
  window(value) {
    this.__window = value
    return this
  }

  /**
   * @param {string} value
   * @return {LocalStorageStoreBuilder}
   */
  key(value) {
    this.__key = value
    return this
  }

  /**
   *
   * @return {Store<TYPE, TYPE_BUILDER>}
   */
  build() {
    /**
     * @type {string}
     */
    const id = UID(this.__type.name + '_')
    /**
     * @type {LocalStorageStorage}
     */
    const storage = new LocalStorageStorage(
      this.__type,
      id,
      this.__window,
      this.__key
    )
    storage.set(id, this.__initialData)

    return new Store(
      new StoreConfig(
        id,
        this.__initialData,
        new StoreTypeConfig(
          this.__type,
          this.__defaultChecker,
          this.__validator
        ),
        storage
      )
    )
  }
}
