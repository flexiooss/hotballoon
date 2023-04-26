import {StoreMap} from './StoreMap.js'
import {ListenedStoreMap} from './ListenedStoreMap.js'
import {AlreadyRegisteredException} from '../Exception/AlreadyRegisteredException.js'
import {TypeCheck} from '../Types/TypeCheck.js'
import {listenedEventInterface} from "../Event/ListenedEvent.js";

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
   * @param {StoreBase} store
   * @return {StoreBase}
   */
  attach(store) {
    if (this.#stores.has(store.ID())) {
      throw AlreadyRegisteredException.STORE(store.ID())
    }
    this.#stores.set(store.ID(), store)
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
   * @param {?function(state: StoreState<TYPE>)} [guard=null]
   * @return {ListenedStore}
   */
  listen(store, callback, priority = 100, guard = null) {
    TypeCheck.assertStoreBase(store)
    const listenedStore = store.listenChanged(callback, priority, guard)
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

/**
 * @implements {ListenedEvent}
 */
class ListenedStore extends listenedEventInterface() {
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
    super()
    this.#handler = handler
    this.#token = token
  }

  /**
   * @return {string}
   */
  token() {
    return this.#token
  }


  remove() {
    this.#handler.unListen(this.#token)
  }
}
