import {WithIDBase} from '../bases/WithIDBase'
import {assert, assertType, isFunction, isNull} from '@flexio-oss/assert'
import {StorageInterface} from './Storage/StorageInterface'

import {EventOrderedHandler} from '../Event/EventOrderedHandler'
import {STORE_CHANGED} from './StoreInterface'
import {ValidationError} from '../Exception/ValidationError'
import {EventListenerOrderedBuilder} from '../Event/EventListenerOrderedBuilder'
import {LoggerInterface, FakeLogger} from '@flexio-oss/js-logger'

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
 * @template TYPE
 * @implements {GenericType<TYPE>}
 */
export class StoreBase extends WithIDBase {
  /**
   * @constructor
   * @param {StoreBaseParams<TYPE>} storeBaseParams
   */
  constructor(storeBaseParams) {
    super(storeBaseParams.id)
    var storage = storeBaseParams.storage
    var logger = fakeLogger

    assertType(storage instanceof StorageInterface,
      'hotballoon:' + this.constructor.name + ':constructor: `storage` argument should be an instance of `StorageInterface`')

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
       * @property {EventOrderedHandler}
       * @name StoreBase#_EventHandler
       * @protected
       */
      [_EventHandler]: {
        enumerable: false,
        configurable: false,
        value: Object.seal(new EventOrderedHandler())
      },
      /**
       * @property {StoreParams}
       * @name StoreBase#[_storeParams]
       * @protected
       */
      [_storeParams]: {
        enumerable: false,
        configurable: false,
        writable: false,
        value: storeBaseParams
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
   * @returns {!StoreState<TYPE>} state frozen
   */
  state() {
    return this[_get]()
  }

  /**
   *
   * @return {Class<TYPE>}
   */
  get __type__() {
    return this[_storeParams].type
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
   * @param {EventListenerOrderedParam} eventListenerOrderedParam
   * @return {String} token
   */
  subscribe(eventListenerOrderedParam) {
    return this[_EventHandler].on(eventListenerOrderedParam)
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
    this[_dispatch](STORE_CHANGED)
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
   * @param {StoreBase~changedClb} clb
   * @return {string} token
   */
  listenChanged(clb = (state) => true) {
    assertType(
      isFunction(clb),
      'hotballoon:' + this.constructor.name + ':listenChanged: `clb` argument should be callable'
    )

    return this.subscribe(
      EventListenerOrderedBuilder
        .listen(STORE_CHANGED)
        .callback((payload) => {
          clb(payload)
        })
        .build()
    )
  }

  /**
   *
   * @callback StoreBase~changedClb
   * @param {StoreState} state
   */
}
