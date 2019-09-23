import {ActionDispatcher} from './ActionDispatcher'
import {ActionDispatcherConfig} from './ActionDispatcherConfig'
import {ActionTypeConfig} from './ActionTypeConfig'
import {UID} from '@flexio-oss/js-helpers'
import {assertType} from '@flexio-oss/assert'

/**
 * @template TYPE, TYPE_BUILDER
 */
export class ActionDispatcherBuilder {
  /**
   *
   * @param {PublicActionDispatcherConfig<TYPE, TYPE_BUILDER>} publicActionParams
   * @return {ActionDispatcher<TYPE, TYPE_BUILDER>}
   */
  static build(publicActionParams) {

    assertType(
      publicActionParams instanceof PublicActionDispatcherConfig,
      'hotballoon:ActionDispatcherBuilder:build: `publicActionParams` should be an instance of PublicActionDispatcherConfig'
    )

    return new ActionDispatcher(
      new ActionDispatcherConfig(
        UID(publicActionParams.params.name + '_'),
        publicActionParams.params,
        publicActionParams.dispatcher
      )
    )
  }
}

/**
 * @template TYPE, TYPE_BUILDER
 */
export class PublicActionDispatcherConfig {
  /**
   *
   * @param {ActionTypeConfig<TYPE, TYPE_BUILDER>} actionTypeConfig
   * @param {Dispatcher} dispatcher
   */
  constructor(actionTypeConfig, dispatcher) {
    this._params = actionTypeConfig
    this._dispatcher = dispatcher
  }

  /**
   *
   * @return {ActionTypeConfig<TYPE, TYPE_BUILDER>}
   */
  get params() {
    return this._params
  }

  /**
   *
   * @return {Dispatcher}
   */
  get dispatcher() {
    return this._dispatcher
  }
}
