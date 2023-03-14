import {assert, isNull, isPrimitive} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {deepFreezeSeal} from '@flexio-oss/js-commons-bundle/js-generator-helpers/index.js'
import {UIDMini} from "@flexio-oss/js-commons-bundle/js-helpers/index.js";


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
   * @type {string}
   */
  #id = UIDMini()

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
   * @return {string}
   */
  id() {
    return this.#id
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
