import {assertType} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {TypeCheck} from '../Types/TypeCheck.js'
import {ActionTypeConfig} from './ActionTypeConfig.js'

/**
 * @template TYPE, TYPE_BUILDER
 */
export class ActionDispatcherConfig {
  /**
   * @type {Symbol|String}
   */
  #id
  /**
   * @type {ActionTypeConfig<TYPE, TYPE_BUILDER>}
   */
  #params
  /**
   * @type {Dispatcher}
   */
  #dispatcher
  /**
   * @param {(Symbol|String)} id
   * @param {ActionTypeConfig<TYPE, TYPE_BUILDER>} actionTypeParam
   * @param {Dispatcher} dispatcher
   */
  constructor(id, actionTypeParam, dispatcher) {

    assertType(actionTypeParam instanceof ActionTypeConfig,
      'hotballoon:ActionDispatcherConfig:constructor "actionTypeParam" should be ActionTypeConfig'
    )

    this.#id = id
    this.#params = actionTypeParam
    this.#dispatcher = TypeCheck.assertIsDispatcher(dispatcher)
  }

  /**
   * @return {(Symbol|String)}
   */
  id() {
    return this.#id
  }

  /**
   * @return {TYPE.}
   */
  type() {
    return this.#params.type()
  }

  /**
   * @return {TYPE_BUILDER.}
   */
  payloadBuilder() {
    return this.#params.payloadBuilder()
  }

  /**
   * @return {?ValueObjectValidator}
   */
  validator() {
    return this.#params.validator()
  }

  /**
   * @return {ActionTypeConfig~defaultCheckerClb<TYPE>}
   */
  defaultChecker() {
    return this.#params.defaultChecker()
  }

  /**
   * @return {Dispatcher}
   */
  dispatcher() {
    return this.#dispatcher
  }
}
