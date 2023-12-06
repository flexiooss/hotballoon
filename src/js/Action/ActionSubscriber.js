import {CLASS_TAG_NAME, CLASS_TAG_NAME_ACTION_SUBSCRIBER} from '../Types/HasTagClassNameInterface.js'
import {WithID} from '../abstract/WithID.js'
import {assertInstanceOf, isNull} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {ActionDispatcherConfig} from './ActionDispatcherConfig.js'
import {ListenedAction} from './ListenedAction.js'
import {EventListenerConfigBuilder} from '@flexio-oss/js-commons-bundle/event-handler/index.js'
import {RemovedException} from "../Exception/RemovedException.js";
import {ActionResponseBuilder} from "./ActionResponseBuilder.js";
import {TypeCheck} from "@flexio-oss/js-commons-bundle/assert/index.js";
import {ActionEventListenerConfigBuilder} from "./ActionEventListenerConfigBuilder.js";

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
   * @param {function(ActionEventListenerConfigBuilder<TYPE>):EventListenerConfig} eventListenerConfigBuilderClb
   * @returns {ListenedAction}
   */
  listen(eventListenerConfigBuilderClb) {
    if (this.isRemoved()) {
      throw RemovedException.ACTION(this._ID)
    }
    TypeCheck.assertIsFunction(eventListenerConfigBuilderClb)
    const config = eventListenerConfigBuilderClb.call(null, ActionEventListenerConfigBuilder.listen(this.ID()))
    const baseCallback = config.callback()
    /**
     * @type {string}
     */
    const token =
      this.#config.dispatcher()
        .addActionListener(
          config.withCallback(
            /**
             * @param {?TYPE} payload
             * @param {string} type
             * @param {string} executionId
             */
            (payload, type, executionId) => {
              baseCallback.call(
                null,
                payload,
                new ActionResponseBuilder(
                  this.config().dispatcher(),
                  this.constructor.responseEventDispatcher(this.ID()), executionId),
                type,
                executionId
              )
            }
          )
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
    this.#config.dispatcher().removeEventListener(this.constructor.responseEventDispatcher(this.ID()))
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
  static from(inst) {
    return new this(inst.config())
  }

  /**
   * @param {string} id
   * @return {string}
   */
  static responseEventDispatcher(id) {
    return `__ACTION_RESPONSE__${id}`
  }
}
