import {UID} from '@flexio-oss/js-commons-bundle/js-helpers/index.js'
import {Store} from './Store.js'
import {StoreConfig} from './StoreConfig.js'
import {InMemoryStorage} from './Storage/InMemoryStorage.js'
import {StoreState} from './StoreState.js'
import {StoreTypeConfig} from './StoreTypeConfig.js'
import {isNull, TypeCheck} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {SingleStateStore} from "./SingleStateStore.js";
import {AbstractStoreBuilder} from "./AbstractStoreBuilder.js";

/**
 *
 * @template TYPE
 * @template TYPE_BUILDER
 */
export class InMemoryStoreBuilder extends AbstractStoreBuilder{
  /**
   * @type {?TYPE}
   */
  #initialData = null
  /**
   * @type {?ValueObjectValidator}
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
   * @type {function(StoreConfig):StoreInterface}
   */
  #builder = config => new Store(config)

  /**
   * @param {function(StoreConfig):StoreInterface} value
   * @return {InMemoryStoreBuilder}
   */
  builder(value) {
    this.#builder = TypeCheck.assertIsArrowFunction(value)
    return this
  }

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
    this.#builder = config => new SingleStateStore(config)
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
    return UID((isNull(this.#name) ? (isNull(this._type) ? 'NULL' : this._type.name) : this.#name) + '_')
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
        this._type,
        this.#defaultChecker,
        this.#validator
      ),
      new InMemoryStorage(
        this._type,
        new StoreState(
          id,
          this._type,
          this.#initialData
        )
      )
    )

    return this.#builder.call(null, config)
  }
}
