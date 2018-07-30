import {assert, isString} from 'flexio-jshelpers'

export class ActionParams {
  /**
   *
   * @param {string} name
   * @param actionPayloadClass
   */
  constructor(name, actionPayloadClass) {
    assert(!!name && isString(name),
      'hotballoon:ActionParams:constructor "name" argument should not be empty'
    )
    // TODO isClass(actionPayloadClass)
    assert(!!actionPayloadClass,
      'hotballoon:ActionParams:constructor "actionPayloadClass" argument should not be empty'
    )
    this._name = name
    this._actionPayloadClass = actionPayloadClass
  }

  get name() {
    return this._name
  }

  get actionPayloadClass() {
    return this._actionPayloadClass
  }
}
