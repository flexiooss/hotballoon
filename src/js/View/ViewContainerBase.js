import {NotOverrideException, TypeCheck as TypeTypeCheck} from '@flexio-oss/js-commons-bundle/assert'
import {WithID} from '../abstract/WithID'
import {OrderedEventHandler} from '../Event/OrderedEventHandler'
import {ViewContainerBaseMap} from './ViewContainerBaseMap'
import {StoresHandler} from '../Store/StoresHandler'


/**
 * @extends WithID
 * @abstract
 */
export class ViewContainerBase extends WithID {
  /**
   * @type {StoresHandler}
   */
  #stores
  /**
   * @type {LoggerInterface}
   */
  #logger
  /**
   * @type {Element}
   */
  #parentNode
  /**
   * @type {OrderedEventHandler}
   */
  #eventHandler = new OrderedEventHandler()
  /**
   * @type {ViewContainerBaseMap}
   */
  #views = new ViewContainerBaseMap()
  /**
   * @type {boolean}
   */
  #mounted = false
  /**
   * @type {boolean}
   */
  #rendered = false
  /**
   * @type {boolean}
   */
  #removed = false

  /**
   * @param {String} id
   * @param {LoggerInterface} logger
   */
  constructor(id, logger) {
    super(id)
    this.#stores = new StoresHandler(logger)
  }

  /**
   * @protected
   * @param {boolean} v
   */
  set _mounted(v) {
    this.#mounted = TypeTypeCheck.assertIsBoolean(v)
  }

  /**
   * @param {boolean} v
   * @protected
   */
  set _rendered(v) {
    this.#rendered = TypeTypeCheck.assertIsBoolean(v)
  }

  /**
   * @protected
   * @return {boolean}
   */
  get _mounted() {
    return this.#mounted
  }

  /**
   * @protected
   * @return {boolean}
   */
  get _rendered() {
    return this.#rendered
  }


  /**
   * @param {Element} v
   */
  set parentNode(v) {
    this.#parentNode = TypeTypeCheck.assertIsNode(v)
  }

  /**
   * @return {Element}
   */
  get parentNode() {
    return this.#parentNode
  }

  /**
   * @return {LoggerInterface}
   */
  logger() {
    return this.#logger
  }

  /**
   * @return {StoresHandler}
   */
  stores() {
    return this.#stores
  }

  /**
   * @protected
   * @param {OrderedEventListenerConfig} orderedEventListenerConfig
   * @return {(String|StringArray)} token
   */
  _on(orderedEventListenerConfig) {
    return this.#eventHandler.on(orderedEventListenerConfig)
  }

  /**
   * @param {(String|Symbol)} eventType
   * @param {Object} payload
   */
  dispatch(eventType, payload) {
    this.#eventHandler.dispatch(eventType, payload)
  }

  remove() {
    this.#removed = true
    this.#eventHandler.clear()
    this.#stores.remove()

    this.views().forEach(
      /**
       * @param {View} v
       */
      v => {
        v.remove()
      })

    this.views().clear()
    this._mounted = false
    this._rendered = false
  }

  /**
   * @param {View} view
   * @return {View}
   */
  addView(view) {
    this.#views.set(view.ID(), view)
    return view
  }

  /**
   * @param {View} view
   * @return {this}
   */
  removeView(view) {
    if (this.#views.has(view.ID())) {
      this.#views.delete(view.ID())
    }
    return this
  }

  /**
   * @param {String} viewId
   * @return {View}
   */
  view(viewId) {
    return this.#views.get(viewId)
  }

  /**
   * @return {ViewContainerBaseMap}
   */
  views() {
    return this.#views
  }

  /**
   * @return {boolean}
   */
  isRendered() {
    return this.#rendered === true
  }

  /**
   * @return {boolean}
   */
  isMounted() {
    return this.#mounted === true
  }

  /**
   * @return {boolean}
   */
  isRemoved() {
    return this.#removed === true
  }

  /**
   * @return {string}
   * @abstract
   */
  AppID() {
    throw NotOverrideException.FROM_ABSTRACT('Hotballoon/ViewContainerBase::AppID')
  }

  /**
   * @return {string}
   * @abstract
   */
  componentID() {
    throw NotOverrideException.FROM_ABSTRACT('Hotballoon/ViewContainerBase::componentID')
  }

  /**
   * @return {ViewRenderConfig}
   * @abstract
   */
  viewRenderConfig() {
    throw NotOverrideException.FROM_ABSTRACT('Hotballoon/ViewContainerBase::viewRenderConfig')
  }
}
