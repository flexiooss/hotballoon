import {NodeEventListenerParam} from './NodeEventListenerParam'

export class NodeEventListenerFactory {
  /**
   *
   * @param {String} event
   */
  constructor(event = '') {
    /**
     *
     * @type {string}
     * @protected
     */
    this._event = event
    /**
     *
     * @type {Function}
     * @callback
     * @protected
     */
    this._callback = () => true
    /**
     *
     * @type {boolean}
     * @protected
     */
    this._capture = false
    /**
     *
     * @type {boolean}
     * @protected
     */
    this._once = false
    /**
     *
     * @type {boolean}
     * @protected
     */
    this._passive = false
  }

  /**
   *
   * @param {String} event
   * @return {EventListenerFactory}
   * @constructor
   */
  static listen(event) {
    return new this(event)
  }

  /**
   *
   * @param {Function} clb
   * @return {EventListenerFactory}
   */
  callback(clb) {
    this._callback = clb
    return this
  }

  /**
   *
   * @param {boolean} [capture = true]
   * @return {NodeEventListenerFactory}
   */
  capture(capture = true) {
    this._capture = capture
    return this
  }

  /**
   *
   * @param {boolean} [once = true]
   * @return {NodeEventListenerFactory}
   */
  once(once = true) {
    this._once = once
    return this
  }

  /**
   *
   * @param {boolean} [passive = true]
   * @return {NodeEventListenerFactory}
   */
  passive(passive = true) {
    this._passive = passive
    return this
  }

  /**
   *
   * @return {NodeEventListenerParam}
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
      return NodeEventListenerParam.createWithOptions(this._event, this._callback, options)
    } else {
      return NodeEventListenerParam.create(this._event, this._callback)
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
