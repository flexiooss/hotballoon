import {ListenedStoreMap} from './ListenedStoreMap.js'
import {AlreadyRegisteredException} from '../Exception/AlreadyRegisteredException.js'
import {TypeCheck} from '../Types/TypeCheck.js'
import {listenedEventInterface} from "../Event/ListenedEvent.js";
import {ListenedStore} from "./ListenedStore.js";
import {assertImplementsListenable} from "./Listenable.js";
import {FlexMap} from '@flexio-oss/js-commons-bundle/flex-types/index.js'

/**
 * @extends {FlexMap<?Listenable>}
 */
 class StoreMap extends FlexMap {
  _validate(v) {
    assertImplementsListenable(v)
  }
}
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
   * @param {Listenable} store
   * @return {Listenable}
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
   * @param {Listenable} store
   * @param {OrderedEventListenerConfig|function(OrderedEventListenerConfigBuilder):OrderedEventListenerConfig} orderedEventListenerConfig
   * @return {HandledListenedStore}
   */
  listen(store, orderedEventListenerConfig) {
    assertImplementsListenable(store)
    const listenedStore = store.listenChanged(orderedEventListenerConfig)
    this.#listenedStores.set(listenedStore.token(), listenedStore)

    return new HandledListenedStore(this, listenedStore.token())
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
class HandledListenedStore extends listenedEventInterface() {
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
