import {deepFreezeSeal, assert, isPrimitive} from 'flexio-jshelpers'

export class EventAction {
  /**
   *
   * @param {string} name
   * @param {*} payload
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
   * @return {string}
   */
  get name() {
    return this.__name
  }

  /**
   *
   * @return {*}
   */
  get payload() {
    return this.__payload
  }

  /**
   *
   * @param {string} name
   * @param {*} payload
   * @readonly
   * @return {EventAction}
   */
  static create(name, payload) {
    return deepFreezeSeal(new this(name, payload))
  }
}
