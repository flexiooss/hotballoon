import {UID} from '@flexio-oss/js-commons-bundle/js-helpers/index.js'
import {StoreConfig} from './StoreConfig.js'
import {JsStorageImplStorage} from './Storage/JsStorageImplStorage.js'
import {StoreTypeConfig} from './StoreTypeConfig.js'
import {isNull} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {JSStorageStore} from "./JSStorageStore.js";
import {AbstractStoreBuilder} from "./AbstractStoreBuilder.js";

/**
 * @template TYPE, TYPE_BUILDER
 */
export class JsStorageStoreBuilder extends AbstractStoreBuilder{

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
   * @type {?Storage}
   */
  #storage = null
  /**
   * @type {?string}
   */
  #key = null
  /**
   * @type {?string}
   */
  #name = null
  /**
   * @type {?Window}
   */
  #window = null

  /**
   * @param {string} name
   * @return {this}
   */
  name(name) {
    this.#name = name.replace(new RegExp('\\s+', 'g'), '')
    return this
  }

  /**
   * @param {TYPE} initialData
   * @return {this}
   */
  initialData(initialData) {
    this.#initialData = initialData
    return this
  }

  /**
   * @param {StoreTypeConfig~defaultCheckerClb<TYPE>} defaultChecker
   * @return {this}
   */
  defaultChecker(defaultChecker) {
    this.#defaultChecker = defaultChecker
    return this
  }

  /**
   * @param {?ValueObjectValidator} validator
   * @return {this}
   */
  validator(validator) {
    this.#validator = validator
    return this
  }

  /**
   * @desc Window.sessionStorage | Window.localStorage
   * @param {Storage} value
   * @return {this}
   */
  storage(value) {
    this.#storage = value
    return this
  }

  /**
   * @param {Window} window
   * @return {this}
   */
  localStorage(window) {
    this.#storage = window.localStorage
    this.#window = window
    return this
  }
  /**
   * @param {Window} window
   * @return {this}
   */
  sessionStorage(window) {
    this.#storage = window.sessionStorage
    // this.#window = window
    return this
  }

  /**
   * @param {string} value
   * @return {this}
   */
  key(value) {
    this.#key = value
    return this
  }

  /**
   * @return {string}
   */
  #uniqName() {
    return UID((isNull(this.#name) ? this._type.name : this.#name) + '_')
  }

  /**
   * @return {Store<TYPE, TYPE_BUILDER>}
   */
  build() {
    /**
     * @type {string}
     */
    const id = this.#uniqName()

    /**
     * @type {StorageInterface}
     */
    const storage = new JsStorageImplStorage(
      this._type,
      id,
      this.#storage,
      this.#key
    )

    if (isNull((storage.get()?.data() ?? null))) {
      storage.set(id, this.#initialData)
    }

    return new JSStorageStore(
      new StoreConfig(
        id,
        this.#initialData,
        new StoreTypeConfig(
          this._type,
          this.#defaultChecker,
          this.#validator
        ),
        storage
      ),
      this.#window,
      this.#key
    )
  }
}
