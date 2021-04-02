import {CLASS_TAG_NAME, CLASS_TAG_NAME_ACTION_SUBSCRIBER} from '../Types/HasTagClassNameInterface'
import {WithID} from '../abstract/WithID'
import {assertInstanceOf, isNull} from '@flexio-oss/js-commons-bundle/assert'
import {ActionDispatcherConfig} from './ActionDispatcherConfig'
import {ListenedAction} from './ListenedAction'
import {EventListenerConfigBuilder} from '@flexio-oss/js-commons-bundle/event-handler'

/**
 * @implements {HasTagClassNameInterface}
 * @implements {GenericType<TYPE>}
 * @template TYPE, TYPE_BUILDER
 */
export class ActionSubscriber extends WithID {
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
   * @param {symbol} HBClassName
   */
  constructor(config, HBClassName = CLASS_TAG_NAME_ACTION_SUBSCRIBER) {
    super(config.id())
    this.#config = assertInstanceOf(config, ActionDispatcherConfig, 'ActionDispatcherConfig')

    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: HBClassName
    })
  }

  /**
   * @return {ActionDispatcherConfig<TYPE, TYPE_BUILDER>}}
   */
  config() {
    return this.#config
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
          EventListenerConfigBuilder
            .listen(this.ID())
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

  /**
   * @return {boolean}
   */
  isRemoved() {
    return this.#removed
  }

  /**
   * @param {ActionSubscriber} inst
   * @return {ActionSubscriber}
   */
  static from(inst){
    return new this(inst.config())
  }
}
