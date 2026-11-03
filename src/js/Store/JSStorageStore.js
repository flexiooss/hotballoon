import {Store} from './Store.js'
import {assertInstanceOf, isNull} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {globalFlexioImport} from '@flexio-oss/js-commons-bundle/global-import-registry/index.js'
import {UIDMini} from '@flexio-oss/js-commons-bundle/js-helpers/index.js'
import {JsStorageImplStorage} from './Storage/JsStorageImplStorage.js'

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
   * @type {Map<string, Set<JSStorageStore>>}
   * @private
   */
  #stores = new Map()
  /**
   * @type {boolean}
   */
  #initialized = false
  /**
   * @type {?BroadcastChannel}
   */
  #bc = null
  /**
   * IDs of the messages posted by this tab, which still have to come back to #bc
   * @type {Set<string>}
   */
  #sentMessageIds = new Set()

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
   * @param {Window} window
   * @return {StoragesHandler}
   */
  #init(window) {
    this.#initialized = true
    this.#bc = new BroadcastChannel(JSStorageStore.BC_KEY)
    this.#bc.onmessage = this.__storageEventClb
    return this
  }

  /**
   * @param {MessageEvent} message
   * @private
   */
  __storageEventClb(message) {
    const data = message?.data ?? null
    if (!isNull(data)) {
      /**
       * @type {StoreMessage}
       */
      const storeMessage = globalFlexioImport.io.flexio.hotballoon.types.StoreMessage.fromObject(data).build()

      /**
       * @type {StoragesHandler}
       */
      const handler = StoragesHandler.getInstance()
      // This tab's own cache is already up to date
      if (!handler.#sentMessageIds.delete(storeMessage.id())) {
        JsStorageImplStorage.invalidate(storeMessage.storageKey())
      }
      if (handler.#stores.has(storeMessage.storageKey())) {
        /**
         * @type {Set<JSStorageStore>}
         */
        const stores = handler.#stores.get(storeMessage.storageKey())
        stores.forEach((store) => {
          if (store.ID() !== storeMessage.storeId()) {
            store.dispatchStorageChange()
          }
        })
      }
    }
  }

  /**
   * @param {string} messageId
   * @return {StoragesHandler}
   */
  markSent(messageId) {
    if (!isNull(this.#bc)) {
      this.#sentMessageIds.add(messageId)
    }
    return this
  }

  /**
   * @param {JSStorageStore} store
   * @return {StoragesHandler}
   */
  register(store) {
    assertInstanceOf(store, JSStorageStore, 'JSStorageStore')
    if (!this.#stores.has(store.JSStorageKey())) {
      this.#stores.set(store.JSStorageKey(), new Set())
    }
    /**
     * @type {Set<JSStorageStore>}
     */
    const stores = this.#stores.get(store.JSStorageKey())

    stores.add(store)

    return this
  }

  /**
   * @param {JSStorageStore} store
   * @return {StoragesHandler}
   */
  unregister(store) {
    assertInstanceOf(store, JSStorageStore, 'JSStorageStore')
    if (this.#stores.has(store.JSStorageKey())) {
      /**
       * @type {Set<JSStorageStore>}
       */
      const stores = this.#stores.get(store.JSStorageKey())
      stores.delete(store)
    }

    return this
  }

  remove() {
    if (!isNull(this.#bc)) {
      this.#bc.close()
      this.#bc = null
    }
    this.#stores.clear()
    this.#sentMessageIds.clear()
  }
}


/**
 *
 * @class
 * @template TYPE
 * @template TYPE_BUILDER
 * @extends {StoreBase<TYPE, TYPE_BUILDER>}
 * @implements {StoreInterface<TYPE, TYPE_BUILDER>}
 * @implements {GenericType<TYPE>}
 * @implements  {HasTagClassNameInterface}
 */
export class JSStorageStore extends Store {
  /**
   * @type {string}
   */
  static BC_KEY = 'FLX_STORE_CHANNEL'
  /**
   * @type {?string}
   */
  #key
  /**
   * @type {?Window}
   */
  #window

  /**
   * @param {StoreConfig<TYPE, TYPE_BUILDER>} storeConfig
   * @param {?Window} [window=null]
   * @param {?string} [key=null]
   */
  constructor(storeConfig, window = null, key = null) {
    super(storeConfig)
    this.#key = key
    this.#window = window
    if (!isNull(window) && !isNull(key)) {
      StoragesHandler.getInstance(window).register(this)
    }
  }

  /**
   * @param {?TYPE} dataStore
   * @throws {RemovedException}
   */
  set(dataStore = null) {
    super.set(dataStore)
    this.#broadcastChange()
  }

  #broadcastChange() {
    const messageId = UIDMini()
    StoragesHandler.getInstance().markSent(messageId)
    let bc = new BroadcastChannel(this.constructor.BC_KEY)
    bc.postMessage(
      globalFlexioImport.io.flexio.hotballoon.types.StoreMessage.builder()
        .id(messageId)
        .storageKey(this.#key)
        .storeId(this.ID())
        .build()
        .toObject()
    )
    bc.close()
    bc = null
  }

  /**
   * @return {?string}
   */
  JSStorageKey() {
    return this.#key
  }

  dispatchStorageChange() {
    if (this.isRemoving()) {
      return
    }
    const state = this.state()
    // No state to dispatch once the storage was cleaned
    if (!isNull(state)) {
      this._dispatch(this.changedEventName(), state)
    }
  }

  remove() {
    StoragesHandler.getInstance().unregister(this)
    super.remove()
  }

  clean() {
    this._storage().clean(this.ID())
    this.#broadcastChange()
  }
}



