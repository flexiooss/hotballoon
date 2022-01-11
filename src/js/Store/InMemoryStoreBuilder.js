import {UID} from '@flexio-oss/js-commons-bundle/js-helpers'
import {Store} from './Store'
import {StoreConfig} from './StoreConfig'
import {InMemoryStorage} from './Storage/InMemoryStorage'
import {StoreState} from './StoreState'
import {StoreTypeConfig} from './StoreTypeConfig'
import {isNull} from '@flexio-oss/js-commons-bundle/assert'
import {SingleStateStore} from "./SingleStateStore";

/**
 * @template TYPE, TYPE_BUILDER
 */
export class InMemoryStoreBuilder {
  /**
   * @type {?TYPE.}
   */
  #type = null
  /**
   * @type {?TYPE}
   */
  #initialData = null
  /**
   * @type  {?ValueObjectValidator}
   */
  #validator = null
  /**
   * @type {StoreTypeConfig~defaultCheckerClb<TYPE>}
   */
  #defaultChecker = v => v
  /**
   * @type {?string}
   */
  #name = null
  /**
   * @type {boolean}
   */
  #singleState = false

  /**
   * @param {string} name
   * @return {InMemoryStoreBuilder}
   */
  name(name) {
    this.#name = name.replace(new RegExp('\\s+', 'g'), '')
    return this
  }

  /**
   * @return {InMemoryStoreBuilder}
   */
  singleState() {
    this.#singleState = true
    return this
  }

  /**
   * @param {TYPE.} type
   * @return {InMemoryStoreBuilder}
   */
  type(type) {
    this.#type = type
    return this
  }

  /**
   * @param {TYPE} initialData
   * @return {InMemoryStoreBuilder}
   */
  initialData(initialData) {
    this.#initialData = initialData
    return this
  }

  /**
   * @param {StoreTypeConfig~defaultCheckerClb<TYPE>} defaultChecker
   * @return {InMemoryStoreBuilder}
   */
  defaultChecker(defaultChecker) {
    this.#defaultChecker = defaultChecker
    return this
  }

  /**
   * @param {?ValueObjectValidator} validator
   * @return {InMemoryStoreBuilder}
   */
  validator(validator) {
    this.#validator = validator
    return this
  }

  /**
   * @return {string}
   * @private
   */
  #uniqName() {
    return UID((isNull(this.#name) ? this.#type.name : this.#name) + '_')
  }

  /**
   * @return {Store<TYPE, TYPE_BUILDER>}
   */
  build() {

    const id = this.#uniqName()
    /**
     * @type {StoreConfig}
     */
    const config = new StoreConfig(
      id,
      this.#initialData,
      new StoreTypeConfig(
        this.#type,
        this.#defaultChecker,
        this.#validator
      ),
      new InMemoryStorage(
        this.#type,
        new StoreState(
          id,
          this.#type,
          this.#initialData
        )
      )
    )

    return (this.#singleState)
      ? new SingleStateStore(config)
      : new Store(config)
  }
}
