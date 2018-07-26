import {EventListenerOrderedFactory} from './EventListenerOrderedFactory'
import {ViewContainerBase} from '../View/ViewContainerBase'
import {assert} from 'flexio-jshelpers'
import {EventListenerOrderedParam} from './EventListenerOrderedParam'

/**
 * @extends EventListenerFactory
 */
export class ViewEventListenerFactory extends EventListenerOrderedFactory {
  /**
   *
   * @param {String} event
   */
  constructor(event = '') {
    super(event)
    /**
     *
     * @type {string}
     * @protected
     */
    this._eventToDispatch = ''
    /**
     *
     * @type {boolean}
     * @protected
     */
    this._isBubble = false
  }

  /**
   *
   * @param {string} event
   * @return {ViewEventListenerFactory}
   */
  bubbleEvent(event) {
    this._eventToDispatch = this._event
    this._isBubble = true
    return this
  }

  /**
   *
   * @param {String} name
   * @return {ViewEventListenerFactory}
   */
  rename(name) {
    this._eventToDispatch = name
    return this
  }

  /**
   *
   * @param {String} event
   * @return {EventListenerFactory}
   * @constructor
   */
  static bubble(event) {
    return new this(event).bubbleEvent(event)
  }

  /**
   *
   * @param {ViewContainerBase} [scope = null]
   * @throws AssertionError
   * @return {EventListenerParam}
   */
  build(scope = null) {
    this._scope = scope
    if (this._isBubble) {
      assert(scope instanceof ViewContainerBase,
        'hotballoon:ViewEventListenerFactory:build: `scope` argument should be an instance of ViewContainerBase')
      this._callback = (payload, type) => {
        this._scope.dispatch(this._eventToDispatch, payload)
      }
    }
    return EventListenerOrderedParam.create(this._event, this._callback, this._scope, this._priority)
  }
}
