import {assert, isNull, isPrimitive} from '@flexio-oss/js-commons-bundle/assert'
import {deepFreezeSeal} from '@flexio-oss/js-commons-bundle/js-generator-helpers'


/**
 * @template TYPE
 */
export class EventAction {
  /**
   * @type {string|Symbol}
   */
  #name
  /**
   * @type {?TYPE}
   */
  #payload = null

  /**
   * @param {(string|Symbol)} name
   * @param {?TYPE} payload
   */
  constructor(name, payload) {
    assert(!!name && isPrimitive(name),
      'hotballoon:EventAction:constructor "name" property should notbe empty'
    )
    assert(isNull(payload) || !!payload,
      'hotballoon:EventAction:constructor "payload" property should not be empty'
    )
    this.#name = name
    this.#payload = payload
  }

  /**
   * @param {(string|Symbol)} name
   * @param {?TYPE} payload
   * @return {EventAction}
   */
  static create(name, payload) {
    return deepFreezeSeal(new EventAction(name, payload))
  }

  /**
   * @return {(string|Symbol)}
   */
  name() {
    return this.#name
  }

  /**
   * @return {?TYPE}
   */
  payload() {
    return this.#payload
  }
}
