import {EventListenerConfig} from './EventListenerConfig'

export class EventListenerConfigBuilder {
  /**
   *
   * @param {String} event
   */
  constructor(event = '') {
    /**
     *
     * @params {string}
     * @protected
     */
    this._event = event
    /**
     *
     * @params {Function}
     * @callback
     * @protected
     */
    this._callback = () => true
    /**
     *
     * @params {boolean}
     * @protected
     */
    this._capture = false
    /**
     *
     * @params {boolean}
     * @protected
     */
    this._once = false
    /**
     *
     * @params {boolean}
     * @protected
     */
    this._passive = false
  }

  /**
   *
   * @param {String} event
   * @return {EventListenerConfigBuilder}
   * @constructor
   */
  static listen(event) {
    return new this(event)
  }

  /**
   *
   * @param {Function} clb
   * @return {EventListenerConfigBuilder}
   */
  callback(clb) {
    this._callback = clb
    return this
  }

  /**
   *
   * @param {boolean} [capture = true]
   * @return {EventListenerConfigBuilder}
   */
  capture(capture = true) {
    this._capture = capture
    return this
  }

  /**
   *
   * @param {boolean} [once = true]
   * @return {EventListenerConfigBuilder}
   */
  once(once = true) {
    this._once = once
    return this
  }

  /**
   *
   * @param {boolean} [passive = true]
   * @return {EventListenerConfigBuilder}
   */
  passive(passive = true) {
    this._passive = passive
    return this
  }

  /**
   *
   * @return {EventListenerConfig}
   */
  build() {
    if (this._hasOptions()) {
      const options = {}
      if (this._capture) {
        options.capture = true
      }
      if (this._once) {
        options.once = true
      }
      if (this._passive) {
        options.passive = true
      }
      return EventListenerConfig.createWithOptions(this._event, this._callback, options)
    } else {
      return EventListenerConfig.create(this._event, this._callback)
    }
  }

  /**
   *
   * @return {boolean}
   * @protected
   */
  _hasOptions() {
    return this._capture || this._once || this._passive
  }
}
