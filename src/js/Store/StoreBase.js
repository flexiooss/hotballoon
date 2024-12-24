import {WithID} from '../abstract/WithID.js'
import {
  assertInstanceOf,
  assertType, formatType, isFunction,
  isNull,
  TypeCheck
} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {StorageInterface} from './Storage/StorageInterface.js'

import {OrderedEventHandler} from '../Event/OrderedEventHandler.js'
import {STORE_CHANGED, STORE_REMOVED} from './StoreInterface.js'
import {ValidationError} from '../Exception/ValidationError.js'
import {OrderedEventListenerConfig} from '@flexio-oss/js-commons-bundle/event-handler/index.js'
import {StoreBaseConfig} from './StoreBaseConfig.js'
import {ListenedStore} from './ListenedStore.js'
import {RemovedException} from "../Exception/RemovedException.js";
import {Logger} from '@flexio-oss/js-commons-bundle/hot-log/index.js';
import {StoreEventListenerConfigBuilder} from "./StoreEventListenerConfigBuilder.js";
import {listenableInterface} from "./Listenable.js";

/**
 * @template TYPE, TYPE_BUILDER
 * @implements {GenericType<TYPE>}
 * @implements {StoreInterface<TYPE, TYPE_BUILDER>}
 * @implements {Listenable<TYPE>}
 */
export class StoreBase extends listenableInterface(WithID) {
  /**
   * @type {boolean}
   */
  #removed = false
  /**
   * @type {?function(state:StoreState<TYPE>)}
   */
  #onceOnUpdated = null
  /**
   * @type {?TYPE}
   */
  #initialData = null
  /**
   * @type {?OrderedEventHandler}
   */
  #eventHandler = null
  /**
   * @type {StoreBaseConfig<TYPE, TYPE_BUILDER>}
   */
  #config
  /**
   * @type {Logger}
   */
  #logger = Logger.getLogger(this.constructor.name, 'HotBalloon.StoreBase')
  /**
   * @type {StorageInterface<TYPE>}
   */
  #storage

  /**
   * @constructor
   * @param {StoreBaseConfig<TYPE, TYPE_BUILDER>} storeBaseConfig
   */
  constructor(storeBaseConfig) {
    super(storeBaseConfig.id())

    assertInstanceOf(storeBaseConfig, StoreBaseConfig, 'StoreBaseConfig')
    this.#config = storeBaseConfig
    this.#initialData = storeBaseConfig.initialData()
    this.#storage = storeBaseConfig.storage()
  }

  /**
   * @return {StoreBase}
   */
  #ensureEventHandler() {
    if (isNull(this.#eventHandler)) {
      this.#eventHandler = new OrderedEventHandler(100, () => !this.#removed)
    }
    return this
  }

  /**
   * @param {StorageInterface<TYPE>} value
   */
  #setStorage(value) {
    assertInstanceOf(value, StorageInterface, 'StorageInterface')
    this.#storage = value
    this.#stateUpdated()
  }

  /**
   * @return {this}
   */
  trigChange() {
    this.set(this.state().data())
    return this
  }

  /**
   * @return {?OrderedEventHandler}
   * @protected
   */
  _eventHandler() {
    return this.#eventHandler
  }

  /**
   * @return {string}
   */
  changedEventName() {
    return STORE_CHANGED + '.' + this.storeId()
  }

  /**
   * @return {string}
   */
  removedEventName() {
    return STORE_REMOVED + '.' + this.storeId()
  }

  /**
   * @returns {StorageInterface<TYPE>} state
   * @protected
   */
  _storage() {
    return this.#storage
  }

  /**
   * @returns {StoreState<TYPE>}
   * @frozen
   */
  state() {
    return this.#storage.get()
  }

  /**
   * @return {TYPE.}
   */
  __type__() {
    return this.#config.type()
  }

  /**
   * @return {TYPE_BUILDER}
   */
  dataBuilder() {
    return this.#config.type().builder()
  }

  /**
   * @param {Object} object
   * @return {TYPE_BUILDER}
   */
  dataFromObject(object) {
    return this.#config.type().fromObject(object)
  }

  /**
   * @param {TYPE} instance
   * @return {TYPE_BUILDER}
   */
  dataFrom(instance) {
    return this.#config.type().from(instance)
  }

  /**
   * @param {string} json
   * @return {TYPE_BUILDER}
   */
  dataFromJSON(json) {
    return this.#config.type().fromJSON(json)
  }

  /**
   * @param {Class} constructor
   * @return {boolean}
   */
  isTypeOf(constructor) {
    return this.__type__() === constructor
  }

  /**
   * @return {(Symbol|string)}
   */
  storeId() {
    return this.ID()
  }

  /**
   * @param {String} event
   * @param {String} token
   */
  unSubscribe(event, token) {
    return this.#eventHandler?.removeEventListener(event, token)
  }

  /**
   * @protected
   * @param {String} eventType
   * @param {!StoreState<TYPE>}  payload
   */
  _dispatch(eventType, payload = this.state()) {
    if (payload.time().equals(this.state().time())) {
      this.#eventHandler?.dispatch(eventType, payload)
    }
  }

  /**
   * @param {?TYPE} dataStore
   * @throws {RemovedException}
   */
  set(dataStore = null) {
    if (this.#removed) {
      throw RemovedException.STORE(this.ID())
    }
    this.#setStorage(this.#storage.set(this.ID(), this.validateDataStore(dataStore)))
  }

  /**
   * @param {?TYPE} dataStore
   * @return {?TYPE}
   */
  validateDataStore(dataStore) {
    if (isNull(dataStore)) {
      return null
    }
    const data = this.#config.defaultChecker().call(null, dataStore)

    assertType(data instanceof this.__type__(),
      () => `StoreBase:set: \`dataStore\` should be ${this.__type__().name}, given:${formatType(dataStore)}`
    )

    if (!isNull(this.#config.validator()) && !this.#config.validator().isValid(data)) {
      throw new ValidationError('StoreBase:set: `dataStore` failed validation')
    }
    return data
  }

  #stateUpdated() {
    this.#logger.info('Store STORE_CHANGED : ' + this.ID(), this.state())

    let currentState = this.state()

    try {
      if (!isNull(this.#onceOnUpdated)) {
        let clb = this.#onceOnUpdated
        this.#onceOnUpdated = null
        clb.call(null, currentState)
      }
    } finally {
      this._dispatch(this.changedEventName(), currentState)
    }
  }

  /**
   * @return {boolean}
   */
  isDispatching() {
    return this.#eventHandler?.isDispatching() ?? false
  }

  /**
   * @param {?function(state:StoreState<TYPE>)} clb
   * @return {this}
   */
  onceOnUpdated(clb) {
    if (this.#removed) {
      throw RemovedException.STORE(this._ID)
    }
    this.#onceOnUpdated = TypeCheck.assertIsFunctionOrNull(clb)
    return this
  }

  /**
   * @param {OrderedEventListenerConfig|function(StoreEventListenerConfigBuilder<TYPE>):OrderedEventListenerConfig} orderedEventListenerConfig
   * @return {String} token
   */
  subscribe(orderedEventListenerConfig) {
    if (this.#removed) {
      throw RemovedException.STORE(this._ID)
    }
    this.#ensureEventHandler()
    if (isFunction(orderedEventListenerConfig)) {
      orderedEventListenerConfig = orderedEventListenerConfig.call(null, StoreEventListenerConfigBuilder.listen(this.changedEventName()))
    }
    assertInstanceOf(orderedEventListenerConfig, OrderedEventListenerConfig, 'OrderedEventListenerConfig')
    return this.#eventHandler.on(orderedEventListenerConfig)
  }

  /**
   * @param {OrderedEventListenerConfig|function(StoreEventListenerConfigBuilder<TYPE>):OrderedEventListenerConfig} orderedEventListenerConfig
   * @return {ListenedStore}
   * @throws {RemovedException}
   */
  listenChanged(orderedEventListenerConfig) {
    if (this.#removed) {
      throw RemovedException.STORE(this._ID)
    }
    this.#ensureEventHandler()

    if (isFunction(orderedEventListenerConfig)) {
      orderedEventListenerConfig = orderedEventListenerConfig.call(null, StoreEventListenerConfigBuilder.listen(this.changedEventName()))
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
      this.changedEventName(),
      token
    )
  }

  /**
   * @param {OrderedEventListenerConfig|function(StoreEventListenerConfigBuilder<TYPE>):OrderedEventListenerConfig} orderedEventListenerConfig
   * @return {ListenedStore}
   * @throws {RemovedException}
   */
  listenRemoved(orderedEventListenerConfig) {
    if (this.#removed) {
      throw RemovedException.STORE(this._ID)
    }
    this.#ensureEventHandler()

    if (isFunction(orderedEventListenerConfig)) {
      orderedEventListenerConfig = orderedEventListenerConfig.call(null, StoreEventListenerConfigBuilder.listen(this.removedEventName()))
    }
    assertInstanceOf(orderedEventListenerConfig, OrderedEventListenerConfig, 'OrderedEventListenerConfig')
    /**
     * @type {string}
     */
    const token = this.#eventHandler.on(orderedEventListenerConfig)

    return new ListenedStore(
      this.#eventHandler,
      this.removedEventName(),
      token
    )
  }

  /**
   * @param {(string|Symbol)} token
   */
  stopListenChanged(token) {
    this.#eventHandler?.removeEventListener(this.changedEventName(), token)
  }

  /**
   * @param {(string|Symbol)} token
   */
  stopListenRemoved(token) {
    this.#eventHandler?.removeEventListener(this.removedEventName(), token)
  }

  remove() {
    this.#eventHandler?.dispatch(this.removedEventName(), null)
    this.#removed = true
    this.#eventHandler?.clear()
    this.#eventHandler = null
    this.#storage = this.#storage.remove(this.ID())
    this.#logger.info('Store REMOVED : ' + this.ID())
  }

  /**
   * @return {boolean}
   */
  isRemoving() {
    return this.#removed
  }

  /**
   * Set value to initial data
   */
  reset() {
    this.set(this.#initialData)
  }
}
