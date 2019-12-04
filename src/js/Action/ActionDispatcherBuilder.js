import {ActionDispatcher} from './ActionDispatcher'
import {ActionDispatcherConfig} from './ActionDispatcherConfig'
import {ActionTypeConfig} from './ActionTypeConfig'
import {UID} from '@flexio-oss/js-helpers'

/**
 * @template TYPE, TYPE_BUILDER
 */
export class ActionDispatcherBuilder {
  constructor() {
    /**
     *
     * @type {?{Dispatcher}}
     * @private
     */
    this.__dispatcher = null
    this.__type = null
    this.__validator = null
    this.__defaultChecker = v => v
  }

  /**
   *
   * @param {Dispatcher} dispatcher
   * @return {ActionDispatcherBuilder}
   */
  dispatcher(dispatcher) {
    this.__dispatcher = dispatcher
    return this
  }

  /**
   *
   * @param {TYPE.} type
   * @return {ActionDispatcherBuilder}
   */
  type(type) {
    this.__type = type
    return this
  }

  /**
   *
   * @param {ActionTypeConfig~defaultCheckerClb<TYPE>} [defaultChecker=data=>data]
   * @return {ActionDispatcherBuilder}
   */
  defaultChecker(defaultChecker) {
    this.__defaultChecker = defaultChecker
    return this
  }

  /**
   *
   * @param {?ValueObjectValidator} validator
   * @return {ActionDispatcherBuilder}
   */
  validator(validator) {
    this.__validator = validator
    return this
  }

  /**
   *
   * @return {ActionDispatcher<TYPE, TYPE_BUILDER>}
   */
  build() {

    return new ActionDispatcher(
      new ActionDispatcherConfig(
        UID(this.__type.name + '_'),
        new ActionTypeConfig(
          this.__type,
          this.__defaultChecker,
          this.__validator
        ),
        this.__dispatcher
      )
    )
  }

}
