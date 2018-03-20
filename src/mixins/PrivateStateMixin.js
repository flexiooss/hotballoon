'use strict'
import {
  MapExtended
} from 'flexio-jshelpers'

/**
 *
 * @class
 * @description Mixin - handle a private state
 */
export const PrivateStateMixin = (Base) => class extends Base {
  /**
     * @description Mixin - init
     * @memberOf PrivateStateMixin
     * @instance
     */
  PrivateStateMixinInit() {
    this._privateState = new MapExtended()
  }

  /**
     * @private
     * @param {String} key
     * @param {mixed}
     * @memberOf PrivateStateMixin
     * @instance
     */
  _setState(key, value) {
    this._privateState.set(key, value)
  }

  /**
     * @private
     * @param {String} key
     * @returns {mixed}
     * @memberOf PrivateStateMixin
     * @instance
     */
  _state(key) {
    return this._privateState.get(key)
  }

  /**
     * @private
     * @param {String} key
     * @memberOf PrivateStateMixin
     * @instance
     */
  _delete(key) {
    this._privateState.delete(key)
  }
}
