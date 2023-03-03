import {ActionDispatcher} from './ActionDispatcher.js'
import {ActionDispatcherConfig} from './ActionDispatcherConfig.js'
import {ActionTypeConfig} from './ActionTypeConfig.js'
import {UID} from '@flexio-oss/js-commons-bundle/js-helpers/index.js'
import {isNull} from '@flexio-oss/js-commons-bundle/assert/index.js'

/**
 * @template TYPE, TYPE_BUILDER
 */
export class ActionDispatcherBuilder {
  /**
   * @type {?Dispatcher}
   */
  #dispatcher = null
  /**
   * @type {?Class<TYPE>}
   */
  #type = null
  /**
   * @type {boolean}
   */
  #withResponse = false
  /**
   * @type {?ValueObjectValidator}
   */
  #validator = null
  /**
   * @type {function(data:TYPE):TYPE}
   */
  #defaultChecker = v => v
  /**
   * @type {?string}
   */
  #name = null

  /**
   * @param {string} name
   * @return {ActionDispatcherBuilder}
   */
  name(name) {
    this.#name = name.replace(new RegExp('\\s+', 'g'), '')
    return this
  }

  /**
   * @param {Dispatcher} dispatcher
   * @return {ActionDispatcherBuilder}
   */
  dispatcher(dispatcher) {
    this.#dispatcher = dispatcher
    return this
  }

  /**
   * @param {?Class<TYPE>} type
   * @return {ActionDispatcherBuilder}
   */
  type(type) {
    this.#type = type
    return this
  }

  /**
   * @param {function(data:TYPE):TYPE} [defaultChecker=data=>data]
   * @return {ActionDispatcherBuilder}
   */
  defaultChecker(defaultChecker) {
    this.#defaultChecker = defaultChecker
    return this
  }

  /**
   * @param {?ValueObjectValidator} validator
   * @return {ActionDispatcherBuilder}
   */
  validator(validator) {
    this.#validator = validator
    return this
  }

  /**
   * @return {ActionDispatcherBuilder}
   */
  withResponse() {
    this.#withResponse = true
    return this
  }

  /**
   * @return {string}
   * @private
   */
  #uniqName() {
    return UID((isNull(this.#name) ? (isNull(this.#type) ? '' : this.#type.name) : this.#name) + '_')
  }

  /**
   * @return {ActionDispatcher<TYPE, TYPE_BUILDER>}
   */
  build() {

    return new ActionDispatcher(
      new ActionDispatcherConfig(
        this.#uniqName(),
        new ActionTypeConfig(
          this.#type,
          this.#defaultChecker,
          this.#validator
        ),
        this.#dispatcher,
        this.#withResponse
      )
    )
  }

}
