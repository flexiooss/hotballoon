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
    this.name = name
    this.payload = payload
  }

  /**
   *
   * @param {string} name
   * @param {*} payload
   * @return {ReadonlyEventAction}
   */
  static create(name, payload) {
    return deepFreezeSeal(new this(name, payload))
  }
}
