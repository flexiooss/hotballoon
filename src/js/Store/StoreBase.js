import {WithID} from '../abstract/WithID'
import {assert, assertType, isFunction, isNumber} from '@flexio-oss/assert'
import {StorageInterface} from './Storage/StorageInterface'

import {OrderedEventHandler} from '../Event/OrderedEventHandler'
import {STORE_CHANGED} from './StoreInterface'
import {ValidationError} from '../Exception/ValidationError'
import {OrderedEventListenerConfigBuilder} from '@flexio-oss/event-handler'
import {LoggerInterface, FakeLogger} from '@flexio-oss/js-logger'
import {StoreBaseConfig} from './StoreBaseConfig'

export const _storage = Symbol('_storage')
export const _EventHandler = Symbol('_EventHandler')
export const _set = Symbol('_set')
export const _get = Symbol('_get')
export const _updated = Symbol('_updated')
export const _dispatch = Symbol('_dispatch')
export const _storeParams = Symbol('_storeParams')

const storeBaseLogOptions = {
  color: 'sandDark',
  titleSize: 2
}
const fakeLogger = new FakeLogger()

/**
 * @template TYPE, TYPE_BUILDER
 * @implements {GenericType<TYPE>}
 */
export class StoreBase extends WithID {
  /**
   * @constructor
   * @param {StoreBaseConfig<TYPE, TYPE_BUILDER>} storeBaseConfig
   */
  constructor(storeBaseConfig) {
    super(storeBaseConfig.id)
    let storage = storeBaseConfig.storage
    let logger = fakeLogger

    assertType(storeBaseConfig instanceof StoreBaseConfig,
      'hotballoon:' + this.constructor.name + ':constructor: `storeBaseConfig` argument should be an instance of `StoreBaseConfig`')

    Object.defineProperties(this, {
      [_storage]: {
        enumerable: false,
        configurable: false,
        /**
         * @name StoreBase#_storage
         * @protected
         */
        get: () => storage,
        set: (v) => {
          assert(v instanceof StorageInterface,
            'hotballoon:' + this.constructor.name + ':constructor: `storage` argument should be an instance of `StorageInterface`')
          storage = v
          this[_updated]()
        }
      },
      /**
       * @property {OrderedEventHandler}
       * @name StoreBase#_EventHandler
       * @protected
       */
      [_EventHandler]: {
        enumerable: false,
        configurable: false,
        value: Object.seal(new OrderedEventHandler())
      },
      /**
       * @property {StoreConfig}
       * @name StoreBase#[_storeParams]
       * @protected
       */
      [_storeParams]: {
        enumerable: false,
        configurable: false,
        writable: false,
        value: storeBaseConfig
      },
      _logger: {
        configurable: false,
        enumerable: false,
        /**
         * @property {LoggerInterface} StoreBase#_logger
         * @name StoreBase#_logger
         * @protected
         */
        get: () => logger,
        set: (v) => {
          assertType(v instanceof LoggerInterface,
            'hotballoon:' + this.constructor.name + ':constructor: `logger` argument should be an instance of `LoggerInterface`')
          logger = v
        }
      }

    })
  }

  /**
   *
   * @return {string}
   */
  changedEventName() {
    return STORE_CHANGED + '.' + this.storeId()
  }

  /**
   * @returns {!StoreState<TYPE>} state frozen
   */
  state() {
    return this[_get]()
  }

  /**
   *
   * @return {TYPE.}
   */
  get __type__() {
    return this[_storeParams].type
  }

  /**
   *
   * @return {TYPE_BUILDER.}
   */
  typeBuilder() {
    return this[_storeParams].typeBuilder
  }

  /**
   *
   * @param {Class} constructor
   * @return {boolean}
   */
  isTypeOf(constructor) {
    return this.__type__ === constructor
  }

  /**
   *
   * @return {(Symbol|string)}
   */
  storeId() {
    return this.ID
  }

  /**
   * @param {OrderedEventListenerConfig}  orderedEventListenerConfig
   * @return {String} token
   */
  subscribe(orderedEventListenerConfig) {
    return this[_EventHandler].on(orderedEventListenerConfig)
  }

  /**
   *
   * @param {LoggerInterface} logger
   */
  setLogger(logger) {
    this._logger = logger
  }

  /**
   * @private
   * @param {String} eventType
   * @param {!StoreState<TYPE>}  payload
   */
  [_dispatch](eventType, payload = this.state()) {
    this[_EventHandler].dispatch(eventType, payload)
  }

  /**
   *
   * @param {TYPE} dataStore
   */
  [_set](dataStore) {
    const data = this[_storeParams].defaultChecker(dataStore)

    assertType(data instanceof this.__type__,
      'StoreBase:set: `dataStore` should be an instanceof `%s`, `%s` given',
      this.__type__.name,
      dataStore.constructor.name
    )

    if (!this[_storeParams].validator(data)) {
      throw new ValidationError('StoreBase:set: `dataStore` failed validation')
    }

    this[_storage] = this[_storage].set(this.ID, data)
  }

  /**
   * @private
   * @return {!StorageInterface<TYPE>}
   */
  [_get]() {
    return this[_storage].get()
  }

  /**
   * @private
   */
  [_updated]() {
    this.logger().log(
      this.logger().builder()
        .info()
        .pushLog('STORE STORE_CHANGED : ' + this.ID)
        .pushLog(this.state()),
      storeBaseLogOptions
    )
    this[_dispatch](this.changedEventName())
  }

  /**
   *
   * @return {LoggerInterface}
   */
  logger() {
    return this._logger
  }

  /**
   *
   * @param {StoreInterface~changedClb} clb
   * @param {number} [priority=100]
   * @return {string} token
   */
  listenChanged(clb, priority = 100) {
    assertType(
      isFunction(clb),
      'hotballoon:' + this.constructor.name + ':listenChanged: `clb` argument should be callable'
    )

    assertType(
      isNumber(priority),
      'hotballoon:' + this.constructor.name + ':listenChanged: `priority` argument should be a number'
    )

    return this[_EventHandler].on(
      OrderedEventListenerConfigBuilder
        .listen(this.changedEventName())
        .callback((payload) => {
          clb(payload)
        })
        .priority(priority)
        .build()
    )
  }

  /**
   *
   * @param {(string|Symbol)} token
   */
  stopListenChanged(token) {
    this[_EventHandler].removeEventListener(this.changedEventName(), token)
  }

}
