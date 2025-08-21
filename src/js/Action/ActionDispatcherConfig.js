import {assertInstanceOf, TypeCheck} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {TypeCheck as HBTypeCheck} from '../Types/TypeCheck.js'
import {ActionTypeConfig} from './ActionTypeConfig.js'

/**
 *
 * @template TYPE
 * @template TYPE_BUILDER
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
   * @type {boolean}
   */
  #withResponse

  /**
   * @param {(Symbol|String)} id
   * @param {ActionTypeConfig<TYPE, TYPE_BUILDER>} actionTypeParam
   * @param {Dispatcher} dispatcher
   * @param {boolean} withResponse
   */
  constructor(id, actionTypeParam, dispatcher, withResponse) {
    this.#id = id
    this.#params = assertInstanceOf(actionTypeParam, ActionTypeConfig, 'ActionTypeConfig')
    this.#dispatcher = HBTypeCheck.assertIsDispatcher(dispatcher)
    this.#withResponse = TypeCheck.assertIsBoolean(withResponse)
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
   * @return {function(data:TYPE):TYPE}
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

  /**
   * @return {boolean}
   */
  withResponse() {
    return this.#withResponse
  }
}
