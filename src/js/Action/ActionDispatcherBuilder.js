import {ActionDispatcher} from './ActionDispatcher.js'
import {ActionDispatcherConfig} from './ActionDispatcherConfig.js'
import {ActionTypeConfig} from './ActionTypeConfig.js'
import {UID} from '@flexio-oss/js-commons-bundle/js-helpers/index.js'
import {isNull} from '@flexio-oss/js-commons-bundle/assert/index.js'

/**
 * @template TYPE, TYPE_BUILDER
 */
export class ActionDispatcherBuilder {
  constructor() {
    /**
     * @type {?Dispatcher}
     * @private
     */
    this.__dispatcher = null
    /**
     * @type {?Class<TYPE>}
     * @private
     */
    this.__type = null
    /**
     * @type {?ValueObjectValidator}
     * @private
     */
    this.__validator = null
    /**
     * @type {function(data:TYPE):TYPE}
     * @private
     */
    this.__defaultChecker = v => v
    /**
     * @type {?string}
     * @private
     */
    this.__name = null
  }

  /**
   * @param {string} name
   * @return {ActionDispatcherBuilder}
   */
  name(name) {
    this.__name = name.replace(new RegExp('\\s+', 'g'), '')
    return this
  }

  /**
   * @param {Dispatcher} dispatcher
   * @return {ActionDispatcherBuilder}
   */
  dispatcher(dispatcher) {
    this.__dispatcher = dispatcher
    return this
  }

  /**
   * @param {?Class<TYPE>} type
   * @return {ActionDispatcherBuilder}
   */
  type(type) {
    this.__type = type
    return this
  }

  /**
   * @param {function(data:TYPE):TYPE} [defaultChecker=data=>data]
   * @return {ActionDispatcherBuilder}
   */
  defaultChecker(defaultChecker) {
    this.__defaultChecker = defaultChecker
    return this
  }

  /**
   * @param {?ValueObjectValidator} validator
   * @return {ActionDispatcherBuilder}
   */
  validator(validator) {
    this.__validator = validator
    return this
  }

  /**
   * @return {string}
   * @private
   */
  __uniqName() {
    return UID((isNull(this.__name) ? (isNull(this.__type) ? '' : this.__type.name) : this.__name) + '_')
  }

  /**
   * @return {ActionDispatcher<TYPE, TYPE_BUILDER>}
   */
  build() {

    return new ActionDispatcher(
      new ActionDispatcherConfig(
        this.__uniqName(),
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
