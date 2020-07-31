import {UID} from '@flexio-oss/js-commons-bundle/js-helpers'
import {Store} from './Store'
import {StoreConfig} from './StoreConfig'
import {InMemoryStorage} from './Storage/InMemoryStorage'
import {StoreState} from './StoreState'
import {StoreTypeConfig} from './StoreTypeConfig'
import {isNull} from '@flexio-oss/js-commons-bundle/assert'

/**
 * @template TYPE, TYPE_BUILDER
 */
export class InMemoryStoreBuilder {
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
     * @type {?string}
     * @private
     */
    this.__name = null
  }

  /**
   * @param {string} name
   * @return {ActionDispatcherBuilder}
   */
  name(name) {
    this.__name = name.replace(new RegExp('\\s+', 'g'), '')
    return this
  }

  /**
   * @param {TYPE.} type
   * @return {InMemoryStoreBuilder}
   */
  type(type) {
    this.__type = type
    return this
  }

  /**
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
   * @return {string}
   * @private
   */
  __uniqName() {
    return UID((isNull(this.__name) ? this.__type.name : this.__name) + '_')
  }

  /**
   * @return {Store<TYPE, TYPE_BUILDER>}
   */
  build() {

    const id = this.__uniqName()

    return new Store(
      new StoreConfig(
        id,
        this.__initialData,
        new StoreTypeConfig(
          this.__type,
          this.__defaultChecker,
          this.__validator
        ),
        new InMemoryStorage(
          this.__type,
          new StoreState(
            id,
            this.__type,
            this.__initialData
          )
        )
      )
    )
  }
}
