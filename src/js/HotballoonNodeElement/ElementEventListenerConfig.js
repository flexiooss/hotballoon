import {deepFreezeSeal} from '@flexio-oss/js-commons-bundle/js-type-helpers'
import {EventListenerConfig} from '../__import__flexio-nodes-reconciliation'

export class ElementEventListenerConfig extends EventListenerConfig {
  /**
   *
   * @param {String} event
   * @param {function(payload<Object>, type<string>)} callback
   * @return {ElementEventListenerConfig}
   * @constructor
   * @readonly
   */
  static create(event, callback) {
    return deepFreezeSeal(new this(event, callback))
  }

  /**
   *
   * @param {String} event
   * @param {function(payload<Object>, type<string>)} callback
   * @param {{capture: boolean, once: boolean, passive: boolean}} options
   * @return {ElementEventListenerConfig}
   * @constructor
   * @readonly
   */
  static createWithOptions(event, callback, options) {
    return deepFreezeSeal(new this(event, callback, options))
  }
}
