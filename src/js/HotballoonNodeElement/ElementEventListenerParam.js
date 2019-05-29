import {deepFreezeSeal} from '@flexio-oss/js-type-helpers'
import {EventListenerParam} from '@flexio-oss/flexio-nodes-reconciliation'

export class ElementEventListenerParam extends EventListenerParam {
  /**
   *
   * @param {String} event
   * @param {function(payload<Object>, type<string>)} callback
   * @return {ElementEventListenerParam}
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
   * @return {ElementEventListenerParam}
   * @constructor
   * @readonly
   */
  static createWithOptions(event, callback, options) {
    return deepFreezeSeal(new this(event, callback, options))
  }
}
