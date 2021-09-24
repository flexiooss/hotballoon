import {WithID} from '../abstract/WithID'
import {
  assert,
  assertInstanceOf,
  assertType,
  isFunction,
  isNull,
  isNumber, NotOverrideException,
  TypeCheck
} from '@flexio-oss/js-commons-bundle/assert'
import {StorageInterface} from './Storage/StorageInterface'

import {OrderedEventHandler} from '../Event/OrderedEventHandler'
import {STORE_CHANGED, STORE_REMOVED} from './StoreInterface'
import {ValidationError} from '../Exception/ValidationError'
import {OrderedEventListenerConfigBuilder} from '@flexio-oss/js-commons-bundle/event-handler'
import {FakeLogger, LoggerInterface} from '@flexio-oss/js-commons-bundle/js-logger'
import {StoreBaseConfig} from './StoreBaseConfig'
import {ListenedStore} from './ListenedStore'
import {RemovedException} from "../Exception/RemovedException";


const storeBaseLogOptions = {
  color: 'sandDark',
  titleSize: 2
}


/**
 * @template TYPE, TYPE_BUILDER
 * @implements {GenericType<TYPE>}
 */
export class StoreBase extends WithID {
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
   * @type {OrderedEventHandler}
   */
  #eventHandler = new OrderedEventHandler(100, () => !this.#removed)
  /**
   * @type {StoreBaseConfig<TYPE, TYPE_BUILDER>}
   */
  #config
  /**
   * @type {LoggerInterface}
   */
  #logger = new FakeLogger()
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
   * @param {StorageInterface<TYPE>} value
   */
  #setStorage(value) {
    assertInstanceOf(value, StorageInterface, 'StorageInterface')
    this.#storage = value
    this.#stateUpdated()
  }

  /**
   * @return {OrderedEventHandler}
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
   * @returns {StoreState<TYPE>} state
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
   * @param {OrderedEventListenerConfig}  orderedEventListenerConfig
   * @return {String} token
   */
  subscribe(orderedEventListenerConfig) {
    if (this.#removed) {
      throw RemovedException.STORE(this._ID)
    }
    return this.#eventHandler.on(orderedEventListenerConfig)
  }

  /**
   * @param {String} event
   * @param {String} token
   */
  unSubscribe(event, token) {
    return this.#eventHandler.removeEventListener(event, token)
  }

  /**
   * @param {LoggerInterface} logger
   */
  setLogger(logger) {
    assertInstanceOf(logger, LoggerInterface, 'LoggerInterface')
    this.#logger = logger
  }

  /**
   * @protected
   * @param {String} eventType
   * @param {!StoreState<TYPE>}  payload
   */
  _dispatch(eventType, payload = this.state()) {
    if (payload.time() === this.state().time()) {
      this.#eventHandler.dispatch(eventType, payload)
    }
  }

  /**
   * @param {TYPE} dataStore
   * @throws {RemovedException}
   */
  set(dataStore) {
    if (this.#removed) {
      throw RemovedException.STORE(this._ID)
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
      'StoreBase:set: `dataStore` should be an instanceof `%s`, `%s` given',
      this.__type__().name,
      dataStore.constructor.name
    )

    if (!isNull(this.#config.validator()) && !this.#config.validator().isValid(data)) {
      throw new ValidationError('StoreBase:set: `dataStore` failed validation')
    }
    return data
  }

  #stateUpdated() {
    this.logger().log(
      this.logger().builder()
        .info()
        .pushLog('STORE STORE_CHANGED : ' + this.ID())
        .pushLog(this.state()),
      storeBaseLogOptions
    )

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
   * @return {LoggerInterface}
   */
  logger() {
    return this.#logger
  }

  /**
   * @param {function(state: StoreState<TYPE>)} callback
   * @param {number} [priority=100]
   * @return {ListenedStore}
   * @throws {RemovedException}
   */
  listenChanged(callback, priority = 100) {
    if (this.#removed) {
      throw RemovedException.STORE(this._ID)
    }
    TypeCheck.assertIsFunction(callback)
    TypeCheck.assertIsNumber(priority)

    /**
     * @type {string}
     */
    const token = this.#eventHandler.on(
      OrderedEventListenerConfigBuilder
        .listen(this.changedEventName())
        .callback((payload) => {
          callback(payload)
        })
        .priority(priority)
        .build()
    )

    return new ListenedStore(
      () => {
        this.stopListenChanged(token)
      },
      token
    )
  }

  /**
   * @param {(string|Symbol)} token
   */
  stopListenChanged(token) {
    this.#eventHandler.removeEventListener(this.changedEventName(), token)
  }

  remove() {
    this._dispatch(this.removedEventName(), null)
    this.#removed = true
    this.#eventHandler.clear()
    this.#storage = this.#storage.set(this.ID(), null)
    this.logger().log(
      this.logger().builder()
        .info()
        .pushLog('STORE REMOVED : ' + this.ID())
        .pushLog(this.state()),
      storeBaseLogOptions
    )
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
