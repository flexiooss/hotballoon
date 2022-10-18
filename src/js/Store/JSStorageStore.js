import {Store} from "./Store";
import {isNull} from "@flexio-oss/js-commons-bundle/assert";

/**
 * @type {Map<string, Store>}
 */
const stores = new Map()

/**
 * @template TYPE, TYPE_BUILDER
 * @extends {StoreBase<TYPE, TYPE_BUILDER>}
 * @implements {StoreInterface<TYPE, TYPE_BUILDER>}
 * @implements {GenericType<TYPE>}
 * @implements  {HasTagClassNameInterface}
 */
export class JSStorageStore extends Store {
  /**
   * @type {?Window}
   */
  #window
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
    this.#window = window
    this.#key = key
    if (!isNull(window) && !isNull(key)) {
      stores.set(key, this)
      window.addEventListener('storage', this.__storageEventClb);
    }
  }

  /**
   * @param {StorageEvent} event
   */
  __storageEventClb(event) {
    if (stores.has(event.key)) {
      const s = stores.get(event.key)
      if (!s.isRemoving()) {
        s._dispatch(s.changedEventName(), s.state())
      }
    }
  }

  remove() {
    super.remove();
    if (!isNull(this.#window) && !isNull(this.#key)) {
      stores.delete(this.#key)
      this.#window.removeEventListener('storage', this.__storageEventClb);
    }
  }
}
