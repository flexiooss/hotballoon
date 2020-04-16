import {assert, isPrimitive} from '@flexio-oss/js-commons-bundle/assert'
import {deepFreezeSeal} from '@flexio-oss/js-commons-bundle/js-type-helpers'

/**
 *
 * @template TYPE
 */
export class EventAction {
  /**
   *
   * @param {(string|Symbol)} name
   * @param {TYPE} payload
   */
  constructor(name, payload) {
    assert(!!name && isPrimitive(name),
      'hotballoon:EventAction:constructor "name" property should notbe empty'
    )
    assert(!!payload,
      'hotballoon:EventAction:constructor "payload" property should not be empty'
    )
    this.__name = name
    this.__payload = payload
  }

  /**
   *
   * @param {(string|Symbol)} name
   * @param {TYPE} payload
   * @return {EventAction}
   */
  static create(name, payload) {
    return deepFreezeSeal(new this(name, payload))
  }

  /**
   *
   * @return {(string|Symbol)}
   */
  name() {
    return this.__name
  }

  /**
   *
   * @return {TYPE}
   */
  payload() {
    return this.__payload
  }
}
