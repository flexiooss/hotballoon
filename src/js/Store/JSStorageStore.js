import {Store} from "./Store";
import {assertInstanceOf, isNull} from "@flexio-oss/js-commons-bundle/assert";

/**
 * @type {?StoragesHandler}
 */
let handler = null

class StoragesHandler {
  /**
   * @type {?Window}
   */
  #window
  /**
   * @type {Map<string, JSStorageStore>}
   * @private
   */
  __stores = new Map()
  /**
   * @type {boolean}
   */
  #initialized = false

  /**
   * @param {Window} window
   * @return {StoragesHandler}
   */
  #init(window) {
    this.#initialized = true
    window.addEventListener('storage', this.__storageEventClb);
    return this
  }

  /**
   * @param {?Window} [window=null]
   * @return {StoragesHandler}
   */
  static getInstance(window = null) {
    if (isNull(handler)) {
      handler = new StoragesHandler()
    }
    if (!isNull(window) && !handler.#initialized) {
      handler.#init(window)
    }
    return handler
  }

  /**
   * @param {StorageEvent} event
   * @private
   */
  __storageEventClb(event) {
    /**
     * @type {StoragesHandler}
     */
    const handler = StoragesHandler.getInstance()
    if (handler.__stores.has(event?.key)) {
      handler.__stores.get(event.key).dispatchStorageChange()
    }
  }

  /**
   * @param {string} key
   * @param {JSStorageStore} store
   * @return {StoragesHandler}
   */
  register(key, store) {
    this.__stores.set(key, assertInstanceOf(store, JSStorageStore, 'JSStorageStore'))
    return this
  }

  /**
   * @param {string} key
   * @return {StoragesHandler}
   */
  unregister(key) {
    this.__stores.delete(key)
    return this
  }

  remove() {
    this.__stores.clear()
    this.#window.removeEventListener('storage', this.__storageEventClb);
  }
}


/**
 * @template TYPE, TYPE_BUILDER
 * @extends {StoreBase<TYPE, TYPE_BUILDER>}
 * @implements {StoreInterface<TYPE, TYPE_BUILDER>}
 * @implements {GenericType<TYPE>}
 * @implements  {HasTagClassNameInterface}
 */
export class JSStorageStore extends Store {
  /**
   * @type {?string}
   * @private
   */
  #key

  /**
   * @param {StoreConfig<TYPE, TYPE_BUILDER>} storeConfig
   * @param {?Window} [window=null]
   * @param {?string} [key=null]
   */
  constructor(storeConfig, window = null, key = null) {
    super(storeConfig)
    this.#key = key
    if (!isNull(window) && !isNull(key)) {
      StoragesHandler.getInstance(window).register(key, this)
    }
  }

  dispatchStorageChange() {
    if (!this.isRemoving()) {
      this._dispatch(this.changedEventName(), this.state())
    }
  }

  remove() {
    StoragesHandler.getInstance().unregister(this.#key)
    super.remove();
  }
}
