import {assert, isFunction, isNumber, isObject} from 'flexio-jshelpers'
import {EventListenerParam} from './EventListenerParam'

export class EventListenerFactory {
  constructor() {
    /**
     *
     * @type {string}
     * @private
     */
    this._event = ''
    /**
     *
     * @type {Function}
     * @callback
     * @private
     */
    this._callback = () => true
    /**
     *
     * @type {scope}
     * @private
     */
    this._scope = null
    /**
     *
     * @type {number}
     * @private
     */
    this._priority = 100
  }

  /**
   *
   * @return {EventListenerFactory}
   * @constructor
   */
  static EventListener() {
    return new this.EventListenerFactory()
  }

  /**
   *
   * @param {String} event
   * @return {EventListenerFactory}
   */
  listen(event) {
    this._event = event
    return this
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
    this.__checkProperty()
    return EventListenerParam.create(this._event, this._callback, this._scope, this._priority)
  }

  /**
   * @throws Error
   * @private
   */
  __checkProperty() {
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
