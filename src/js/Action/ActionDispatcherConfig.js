import {assertType} from '@flexio-oss/assert'
import {TypeCheck} from '../Types/TypeCheck'
import {ActionTypeConfig} from './ActionTypeConfig'

/**
 * @template TYPE, TYPE_BUILDER
 */
export class ActionDispatcherConfig {
  /**
   * @param {(Symbol|String)} id
   * @param {ActionTypeConfig<TYPE, TYPE_BUILDER>} actionTypeParam
   * @param {Dispatcher} dispatcher
   */
  constructor(id, actionTypeParam, dispatcher) {

    assertType(actionTypeParam instanceof ActionTypeConfig,
      'hotballoon:ActionDispatcherConfig:constructor "actionTypeParam" should be ActionTypeConfig'
    )

    assertType(TypeCheck.isDispatcher(dispatcher), 'hotballoon:ActionDispatcherConfig:constructor "dispatcher" argument should be a Dispatcher')
    /**
     *
     * @type {Symbol|String}
     * @protected
     */
    this._id = id
    /**
     *
     * @type {ActionTypeConfig<TYPE, TYPE_BUILDER>}
     * @protected
     */
    this._params = actionTypeParam
    /**
     *
     * @type {Dispatcher}
     * @protected
     */
    this._dispatcher = dispatcher
  }

  /**
   *
   * @return {(Symbol|String)}
   */
  id() {
    return this._id
  }

  /**
   *
   * @return {TYPE.}
   */
  type() {
    return this._params.type()
  }

  /**
   *
   * @return {TYPE_BUILDER.}
   */
  payloadBuilder() {
    return this._params.payloadBuilder()
  }

  /**
   *
   * @return {?ValueObjectValidator}
   */
  validator() {
    return this._params.validator()
  }

  /**
   *
   * @return {ActionTypeConfig~defaultCheckerClb<TYPE>}
   */
  defaultChecker() {
    return this._params.defaultChecker()
  }

  /**
   *
   * @return {Dispatcher}
   */
  dispatcher() {
    return this._dispatcher
  }
}
