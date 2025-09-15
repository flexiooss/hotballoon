import {Throttle, UIDMini} from "@flexio-oss/js-commons-bundle/js-helpers/index.js";
import {assertInstanceOf, isFunction, isNull, TypeCheck} from "@flexio-oss/js-commons-bundle/assert/index.js";
import {OrderedEventHandler} from "../Event/OrderedEventHandler.js";
import {TypeCheck as HBTypeCheck} from "../Types/TypeCheck.js";
import {HBComponent} from "../Component/Component.js";
import {RemovedException} from "../Exception/RemovedException.js";
import {StoreEventListenerConfigBuilder} from "./StoreEventListenerConfigBuilder.js";
import {OrderedEventListenerConfig} from "@flexio-oss/js-commons-bundle/event-handler/index.js";
import {ListenedStore} from "./ListenedStore.js";
import {WithID} from "../abstract/WithID.js";
import {listenableInterface} from "./Listenable.js";

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
   * @type {boolean}
   */
  #async = false


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
  async() {
    this.#async = true;
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
    return new ProxyStoreListenerThrottled(this.#store, throttle, dispatcherClb, this.#async)
  }
}

/**
 *
 * @template TYPE
 * @template TYPE_BUILDER
 * @implements {Listenable<TYPE>}
 * @implements {Component}
 */
class ProxyStoreListenerThrottled extends HBComponent(listenableInterface(WithID)) {
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
   * @type {boolean}
   */
  #async

  /**
   * @param {StoreInterface<TYPE,TYPE_BUILDER>} store
   * @param {Throttle} throttle
   * @param {function(clb:function())} dispatcherClb
   * @param {boolean} async
   */
  constructor(store, throttle, dispatcherClb, async) {
    super(UIDMini(store.storeId()))
    this.#throttle = throttle;
    this.#store = HBTypeCheck.assertStoreBase(store);
    this.#dispatcherClb = dispatcherClb
    this.#async = TypeCheck.assertIsBoolean(async)
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
      throw RemovedException.STORE(this.ID())
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
      if (this.#async) {
        this.#listenedStore = this.#store.listenChanged(builder => builder
          .callback(
            (payload, eventType) => {
              if(this.isRemoving()) return
              this.#dispatcherClb.call(null, () => {
                this.#eventHandler?.dispatch(
                  ProxyStoreListenerThrottled.#CHANGE_STATE,
                  payload,
                  eventType
                )
              })
            }
          )
          .async()
          .build()
        )
      } else {
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
    this.#throttle = null
  }
}