import {assertInstanceOf, assertType, isNull, TypeCheck as TypeTypeCheck} from '@flexio-oss/js-commons-bundle/assert'
import {EventAction} from './EventAction'
import {ActionDispatcherConfig} from './ActionDispatcherConfig'
import {DispatcherEventListenerConfigBuilder} from '../Dispatcher/DispatcherEventListenerConfigBuilder'
import {WithID} from '../abstract/WithID'
import {ValidationError} from '../Exception/ValidationError'
import {CLASS_TAG_NAME, CLASS_TAG_NAME_ACTION} from '../Types/HasTagClassNameInterface'
import {ListenedAction} from './ListenedAction'


/**
 * @implements {HasTagClassNameInterface}
 * @implements {GenericType<TYPE>}
 * @template TYPE, TYPE_BUILDER
 */
export class ActionDispatcher extends WithID {
  /**
   * @type {boolean}
   */
  #removed = false
  /**
   * @type ActionDispatcherConfig<TYPE, TYPE_BUILDER>}
   */
  #config

  /**
   * @param {ActionDispatcherConfig<TYPE, TYPE_BUILDER>} config
   */
  constructor(config) {
    super(config.id())
    this.#config = assertInstanceOf(config, ActionDispatcherConfig, 'ActionDispatcherConfig')

    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_ACTION
    })
  }

  /**
   * @return {?TYPE_BUILDER}
   */
  payloadBuilder() {
    if (isNull(this.#config.type())) {
      return null
    }
    TypeTypeCheck.assertIsFunction(this.#config.type().builder)
    return this.#config.type().builder()
  }

  /**
   * @param {Object} object
   * @return {?TYPE_BUILDER}
   */
  payloadFromObject(object) {
    if (isNull(this.#config.type())) {
      return null
    }
    TypeTypeCheck.assertIsFunction(this.#config.type().fromObject)
    return this.#config.type().fromObject(object)
  }

  /**
   * @param {TYPE} instance
   * @return {?TYPE_BUILDER}
   */
  payloadFrom(instance) {
    if (isNull(this.#config.type())) {
      return null
    }
    TypeTypeCheck.assertIsFunction(this.#config.type().from)
    return this.#config.type().from(instance)
  }

  /**
   * @param {string} json
   * @return {TYPE_BUILDER}
   */
  payloadFromJSON(json) {
    if (isNull(this.#config.type())) {
      return null
    }
    TypeTypeCheck.assertIsFunction(this.#config.type().fromJSON)
    return this.#config.type().fromJSON(json)
  }

  /**
   * @return {?Class<TYPE>}
   */
  __type__() {
    return this.#config.type()
  }

  /**
   * @param {Class} constructor
   * @return {boolean}
   */
  isTypeOf(constructor) {
    if (isNull(this.#config.type())) {
      return isNull(constructor)
    }
    return constructor === this.__type__()
  }

  /**
   * @param {?TYPE} [payload=null]
   */
  dispatch(payload = null) {
    if (this.#removed) {
      return
    }
    if (!isNull(this.#config.type())) {
      const checker = this.#config.defaultChecker()
      /**
       * @type {TYPE}
       */
      const data = checker(payload)

      assertType(
        data instanceof this.__type__(),
        'hotballoon:ActionDispatcher:dispatch "data" argument should be an instance of %s',
        this.__type__().name
      )
      if (!isNull(this.#config.validator()) && !this.#config.validator().isValid(payload)) {
        throw new ValidationError('hotballoon:ActionDispatcher:dispatch "data" argument failed to validation')
      }
    }

    this.#config.dispatcher().dispatchAction(
      EventAction.create(
        this.ID(),
        payload
      )
    )
  }

  /**
   * @param {function(payload: ?TYPE, type: (string|Symbol))} callback
   * @returns {ListenedAction}
   */
  listen(callback) {
    /**
     * @type {string}
     */
    const token =
      this.#config.dispatcher()
        .addActionListener(
          DispatcherEventListenerConfigBuilder
            .listen(this)
            .callback(callback)
            .build()
        )

    return new ListenedAction(this.#config.dispatcher(), this.ID(), token)
  }

  /**
   * @param {...string} token
   */
  waitFor(...token) {
    this.#config.dispatcher().waitFor(this.ID(), token)
  }

  remove() {
    this.#removed = true
    this.#config.dispatcher().removeEventListener(this.ID())
  }
}
