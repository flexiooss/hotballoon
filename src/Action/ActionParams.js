import {assert, isPrimitive} from 'flexio-jshelpers'

export class ActionParams {
  /**
   *
   * @param {string} name
   * @param {ActionPayload} actionPayloadClass
   */
  constructor(name, actionPayloadClass) {
    assert(!!name && isPrimitive(name),
      'hotballoon:ActionParams:constructor "name" argument should not be empty'
    )
    // TODO isClass(actionPayloadClass)
    assert(!!actionPayloadClass,
      'hotballoon:ActionParams:constructor "actionPayloadClass" argument should not be empty'
    )
    this._name = name
    this._actionPayloadClass = actionPayloadClass
  }

  /**
   *
   * @return {string}
   */
  get name() {
    return this._name
  }

  /**
   *
   * @return {ActionPayload}
   */
  get actionPayloadClass() {
    return this._actionPayloadClass
  }
}
