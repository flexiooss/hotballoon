import {NotOverrideException, TypeCheck as TypeTypeCheck} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {WithID} from '../abstract/WithID.js'
import {OrderedEventHandler} from '../Event/OrderedEventHandler.js'
import {ViewContainerBaseMap} from './ViewContainerBaseMap.js'
import {StoresHandler} from '../Store/StoresHandler.js'
import {RemovedException} from "../Exception/RemovedException.js";
import {Logger} from '@flexio-oss/js-commons-bundle/hot-log/index.js';
import {isNull} from "@flexio-oss/js-commons-bundle/assert/index.js";
import {VIEW_REMOVE, VIEW_UNMOUNT} from "./ViewPublicEventHandler.js";


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
   * @type {Logger}
   */
  #logger = Logger.getLogger(this.constructor.name, 'HotBalloon.ViewContainerBase')
  /**
   * @type {Element}
   */
  #parentNode
  /**
   * @type {?OrderedEventHandler}
   */
  #eventHandler = null
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
   */
  constructor(id) {
    super(id)
    this.#stores = new StoresHandler()
  }

  /**
   * @return {ViewContainerBase}
   */
  #ensureEventHandler(){
    if(isNull(this.#eventHandler)){
      this.#eventHandler = new OrderedEventHandler(100, ()=>!this.isRemoved())
    }
    return this
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
   * @return {StoresHandler}
   */
  stores() {
    return this.#stores
  }

  /**
   * @protected
   * @param {OrderedEventListenerConfig} orderedEventListenerConfig
   * @return {(String|StringArray)} token
   * @throws {RemovedException}
   */
  _on(orderedEventListenerConfig) {
    if(this.isRemoved()){
      throw RemovedException.VIEW_CONTAINER(this.ID())
    }
    this.#ensureEventHandler()
    return this.#eventHandler.on(orderedEventListenerConfig)
  }

  /**
   * @param {(String|Symbol)} eventType
   * @param {Object} payload
   * @throws {RemovedException}
   */
  dispatch(eventType, payload) {

    if(this.isRemoved() && !([VIEW_REMOVE, VIEW_UNMOUNT]).includes(eventType)){
      throw RemovedException.VIEW_CONTAINER(this.ID())
    }
    this.#eventHandler?.dispatch(eventType, payload)
  }

  remove() {
    this.#removed = true
    this.#eventHandler?.clear()
    this.#eventHandler = null
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
   * @throws {RemovedException}
   */
  addView(view) {
    if(this.isRemoved()){
      throw RemovedException.VIEW_CONTAINER(this.ID())
    }
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
   * @return {SchedulerHandler}
   * @abstract
   */
  scheduler() {
    throw NotOverrideException.FROM_ABSTRACT('Hotballoon/ViewContainerBase::scheduler')
  }

  /**
   * @return {IntersectionObserverHandler}
   * @abstract
   */
  intersectionObserverHandler() {
    throw NotOverrideException.FROM_ABSTRACT('Hotballoon/ViewContainerBase::intersectionObserverHandler')
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
