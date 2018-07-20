import {assert, isFunction, isNumber, isObject} from 'flexio-jshelpers'
import {EventListenerParam} from './EventListenerParam'

export class EventListenerFactory {
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
     * @type {scope}
     * @protected
     */
    this._scope = null
    /**
     *
     * @type {number}
     * @protected
     */
    this._priority = 100
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
   * @param priority
   * @return {EventListenerFactory}
   */
  priority(priority) {
    this._priority = priority
    return this
  }

  /**
   *
   * @param scope
   * @return {EventListenerParam}
   */
  build(scope) {
    this._scope = scope
    this._checkProperty()
    return EventListenerParam.create(this._event, this._callback, this._scope, this._priority)
  }

  /**
   * @throws Error
   * @protected
   */
  _checkProperty() {
    assert(!!this._event,
      'hotballoon:EventListenerFactory:build: ̀`event` property assert be not empty'
    )
    assert(isFunction(this._callback),
      'hotballoon:EventListenerFactory:build: ̀`callback` property assert be Callable'
    )
    assert(isObject(this._scope) || this._scope === null,
      'hotballoon:EventListenerFactory:build: ̀`scope` property assert be a scope'
    )
    assert(isNumber(this._priority),
      'hotballoon:EventListenerFactory:build: ̀`priority` property assert be a Number'
    )
  }
}
