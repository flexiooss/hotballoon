import {StoreMap} from './StoreMap'
import {ListenedStoreMap} from './ListenedStoreMap'
import {AlreadyRegisteredException} from '../Exception/AlreadyRegisteredException'
import {TypeCheck} from '../Types/TypeCheck'

/**
 * @template TYPE
 */
export class StoresHandler {
  /**
   * @type {StoreMap}
   */
  #stores = new StoreMap()
  /**
   * @type {ListenedStoreMap}
   */
  #listenedStores = new ListenedStoreMap()
  /**
   * @type {LoggerInterface}
   */
  #logger

  /**
   * @param {LoggerInterface} logger
   */
  constructor(logger) {
    this.#logger = logger
  }

  /**
   * @param {StoreBase} store
   * @return {StoreBase}
   */
  attach(store) {
    if (this.#stores.has(store.ID())) {
      throw AlreadyRegisteredException.STORE(store.ID())
    }
    this.#stores.set(store.ID(), store)
    store.setLogger(this.#logger)
    return store
  }

  /**
   * @param {StoreBase} store
   * @return {StoresHandler}
   */
  detach(store) {
    this.#stores.delete(store.ID())
    return this
  }

  /**
   * @param {StoreInterface} store
   * @param {function(state: StoreState<TYPE>)} callback
   * @param {number} [priority=100]
   * @return {ListenedStore}
   */
  listen(store, callback, priority = 100) {
    TypeCheck.assertStoreBase(store)
    const listenedStore =store.listenChanged(callback, priority)
    this.#listenedStores.set(listenedStore.token(), listenedStore)

    return new ListenedStore(this, listenedStore.token())
  }

  /**
   * @param {string} token
   * @return {boolean}
   */
  unListen(token) {
    if (this.#listenedStores.has(token)) {
      this.#listenedStores.get(token).remove()
      this.#listenedStores.delete(token)
      return true
    }
    return false
  }

  remove() {
    this.#stores.forEach(
      /**
       * @param {ActionDispatcher} v
       */
      v => {
        v.remove()
      })

    this.#listenedStores.forEach(
      /**
       * @param {ListenedAction} v
       */
      v => {
        v.remove()
      })

    this.clear()
  }

  /**
   * @return {StoresHandler}
   */
  clear() {
    this.#stores.clear()
    this.#listenedStores.clear()
    return this
  }
}

class ListenedStore {
  /**
   * @type {StoresHandler}
   */
  #handler
  /**
   * @type {string}
   */
  #token

  /**
   * @param  {StoresHandler} handler
   * @param {string} token
   */
  constructor(handler, token) {
    this.#handler = handler
    this.#token = token
  }

  /**
   * @return {string}
   */
  token() {
    return this.#token
  }

  /**
   * @return {boolean}
   */
  remove() {
    return this.#handler.unListen(this.#token)
  }
}
