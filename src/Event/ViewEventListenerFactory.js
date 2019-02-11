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
  }

  /**
   *
   * @param {ViewContainerBase} viewContainerBase
   * @throws AssertionError
   * @return {ViewEventListenerFactory}
   * @private
   */
  __bubbleEvent(viewContainerBase) {
    this._eventToDispatch = this._event
    if (this._isBubble) {
      assert(viewContainerBase instanceof ViewContainerBase,
        'hotballoon:ViewEventListenerFactory:build: `scope` argument should be an instance of ViewContainerBase')
      this._callback = (payload, type) => {
        viewContainerBase.dispatch(this._eventToDispatch, payload)
      }
    }
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
   * @param {ViewContainerBase} viewContainerBase
   * @return {EventListenerFactory}
   * @constructor
   */
  static bubble(event, viewContainerBase) {
    return new this(event).__bubbleEvent(viewContainerBase)
  }

  /**
   *
   * @return {EventListenerOrderedParam}
   */
  build() {
    return EventListenerOrderedParam.create(this._event, this._callback, this._priority)
  }
}
