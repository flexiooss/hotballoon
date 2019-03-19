import {EventListenerOrderedBuilder} from './EventListenerOrderedBuilder'
import {ViewContainerBase} from '../View/ViewContainerBase'
import {assert} from 'flexio-jshelpers'
import {EventListenerOrderedParam} from './EventListenerOrderedParam'

/**
 * @extends EventListenerBuilder
 */
export class ViewEventListenerBuilder extends EventListenerOrderedBuilder {
  /**
   *
   * @param {String} event
   */
  constructor(event = '') {
    super(event)
    /**
     *
     * @params {string}
     * @protected
     */
    this._eventToDispatch = ''
  }

  /**
   *
   * @param {ViewContainerBase} viewContainerBase
   * @throws AssertionError
   * @return {ViewEventListenerBuilder}
   * @private
   */
  __bubbleEvent(viewContainerBase) {
    this._eventToDispatch = this._event
    if (this._isBubble) {
      assert(viewContainerBase instanceof ViewContainerBase,
        'hotballoon:ViewEventListenerBuilder:build: `scope` argument should be an instance of ViewContainerBase')
      this._callback = (payload, type) => {
        viewContainerBase.dispatch(this._eventToDispatch, payload)
      }
    }
    return this
  }

  /**
   *
   * @param {String} name
   * @return {ViewEventListenerBuilder}
   */
  rename(name) {
    this._eventToDispatch = name
    return this
  }

  /**
   *
   * @param {String} event
   * @param {ViewContainerBase} viewContainerBase
   * @return {EventListenerBuilder}
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
