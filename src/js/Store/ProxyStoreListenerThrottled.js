import {Throttle} from "@flexio-oss/js-commons-bundle/js-helpers/index.js";
import {assertInstanceOf, isFunction, isNull} from "@flexio-oss/js-commons-bundle/assert/index.js";
import {OrderedEventHandler} from "../Event/OrderedEventHandler.js";
import {TypeCheck} from "../Types/TypeCheck.js";
import {HBComponent} from "../Component/Component.js";
import {RemovedException} from "../Exception/RemovedException.js";
import {StoreEventListenerConfigBuilder} from "./StoreEventListenerConfigBuilder.js";
import {OrderedEventListenerConfig} from "@flexio-oss/js-commons-bundle/event-handler/index.js";
import {ListenedStore} from "./ListenedStore.js";

export class ProxyStoreListenerThrottledBuilder {
  /**
   * @type {number}
   */
  #timeToThrottle = 200
  /**
   * @type {StoreInterface<TYPE,TYPE_BUILDER>}
   */
  #store = null
  /**
   * @type {string} - FIRST_LAST, FIRST, LAST
   */
  #dispatchingType = 'FIRST_LAST'


  /**
   * @param {number} value
   * @return {ProxyStoreListenerThrottledBuilder}
   */
  timeToThrottle(value) {
    this.#timeToThrottle = value;
    return this
  }

  /**
   * @param {StoreInterface<TYPE,TYPE_BUILDER>} value
   * @return {ProxyStoreListenerThrottledBuilder}
   */
  store(value) {
    this.#store = value;
    return this
  }

  /**
   * @return {ProxyStoreListenerThrottledBuilder}
   */
  dispatchFirst() {
    this.#dispatchingType = 'FIRST';
    return this
  }

  /**
   * @return {ProxyStoreListenerThrottledBuilder}
   */
  dispatchLast() {
    this.#dispatchingType = 'LAST';
    return this
  }

  /**
   * @return {ProxyStoreListenerThrottled}
   */
  build() {
    const throttle = new Throttle(this.#timeToThrottle)
    /**
     * @type {function(clb:function())}
     */
    let dispatcherClb;
    switch (this.#dispatchingType) {
      case 'FIRST':
        dispatcherClb = (clb) => {
          throttle.invokeNow(clb)
        }
        break;
      case 'LAST':
        dispatcherClb = (clb) => {
          throttle.invoke(clb)
        }
        break;
      case 'FIRST_LAST':
        dispatcherClb = (clb) => {
          throttle.invokeAndEnsure(clb)
        }
        break;
    }
    return new ProxyStoreListenerThrottled(this.#store, throttle, dispatcherClb)
  }
}

/**
 * @template TYPE, TYPE_BUILDER
 */
class ProxyStoreListenerThrottled extends HBComponent() {
  static #CHANGE_STATE = 'CHANGE_STATE'
  /**
   * @type {Throttle}
   */
  #throttle
  /**
   * @type {function(clb:function())}
   */
  #dispatcherClb
  /**
   * @type {StoreInterface<TYPE,TYPE_BUILDER>}
   */
  #store
  /**
   * @type {?OrderedEventHandler}
   */
  #eventHandler = null
  /**
   * @type {boolean}
   */
  #removed = false
  /**
   * @type {?ListenedStore}
   */
  #listenedStore = null

  /**
   * @param StoreInterface<TYPE,TYPE_BUILDER>} store
   * @param {Throttle} throttle
   * @param {function(clb:function())} dispatcherClb
   */
  constructor(store, throttle, dispatcherClb) {
    super()
    this.#throttle = throttle;
    this.#store = TypeCheck.assertStoreBase(store);
    this.#dispatcherClb = dispatcherClb
  }

  /**
   * @return {this}
   */
  #ensureEventHandler() {
    if (isNull(this.#eventHandler)) {
      this.#eventHandler = new OrderedEventHandler(100, () => !this.#store.isRemoving() && !this.#removed)
    }
    return this
  }

  /**
   * @param {OrderedEventListenerConfig|function(StoreEventListenerConfigBuilder<TYPE>):OrderedEventListenerConfig} orderedEventListenerConfig
   * @return {ListenedStore}
   */
  listenChanged(orderedEventListenerConfig) {
    if (this.#removed) {
      throw RemovedException.STORE(this.#store.ID())
    }
    this
      .#ensureEventHandler()
      .#subscribeToStore()

    if (isFunction(orderedEventListenerConfig)) {
      orderedEventListenerConfig = orderedEventListenerConfig.call(null, StoreEventListenerConfigBuilder.listen(ProxyStoreListenerThrottled.#CHANGE_STATE))
    }

    assertInstanceOf(orderedEventListenerConfig, OrderedEventListenerConfig, 'OrderedEventListenerConfig')
    /**
     * @type {string}
     */
    const token = this.#eventHandler.on(
      orderedEventListenerConfig.withCallback((payload) => {
        if (!this.#removed) {
          orderedEventListenerConfig.callback().call(null, payload)
        }
      })
    )

    return new ListenedStore(
      this.#eventHandler,
      ProxyStoreListenerThrottled.#CHANGE_STATE,
      token
    )
  }

  /**
   * @return {ProxyStoreListenerThrottled}
   */
  #subscribeToStore() {
    if (isNull(this.#listenedStore)) {
      this.#listenedStore = this.#store.listenChanged(builder => builder
        .callback(
          (payload, eventType) => {
            this.#dispatcherClb.call(null, () => {
              this.#eventHandler?.dispatch(
                ProxyStoreListenerThrottled.#CHANGE_STATE,
                payload,
                eventType
              )
            })
          }
        )
        .build()
      )
    }

    return this
  }

  /**
   * @return {boolean}
   */
  isRemoving() {
    return this.#removed;
  }

  remove() {
    this.#removed = true;
    this.#eventHandler?.clear()
    this.#eventHandler = null
    this.#listenedStore?.remove()
    this.#listenedStore = null
  }
}