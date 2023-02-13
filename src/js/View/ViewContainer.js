import {CLASS_TAG_NAME, CLASS_TAG_NAME_VIEWCONTAINER} from '../Types/HasTagClassNameInterface.js'
import {
  assertInstanceOf,
  TypeCheck as TypeTypeCheck
} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {ViewContainerBase} from './ViewContainerBase.js'
import {ViewContainerPublicEventHandler} from './ViewContainerPublicEventHandler.js'
import {TypeCheck} from '../Types/TypeCheck.js'
import {RemovedException} from "../Exception/RemovedException.js";
import {Logger} from '@flexio-oss/js-commons-bundle/hot-log/index.js';

/**
 * @description viewContainer is a Views container who can subscribe to Stores to dispatch state to Views
 * @extends ViewContainerBase
 * @implements HasTagClassNameInterface
 */
export class ViewContainer extends ViewContainerBase {
  /**
   * @type {ViewContainerParameters}
   */
  #config
  /**
   * @type {Logger}
   */
  #logger = Logger.getLogger(this.constructor.name, 'HotBalloon.ViewContainerBase')

  /**
   * @param {ViewContainerParameters} config
   */
  constructor(config) {
    assertInstanceOf(config, ViewContainerParameters, 'ViewContainerParameters')
    super(config.id())
    this.#config = config
    this.parentNode = config.parentNode()

    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_VIEWCONTAINER
    })

    config.componentContext().viewContainers().attach(this)
  }

  /**
   * @callback ViewContainer~storeChanged
   * @param {Object} state
   * @return {boolean}
   */

  /**
   * @description subscribe subView an events of this fieldView
   * @param {StoreInterface} store
   * @param {ViewContainer~storeChanged} clb
   * @param {?function(data:StoreState<STORE_TYPE>)} [guard=null]
   * @return {ListenedStore}
   */
  subscribeToStore(store, clb = (state) => true,guard=null) {
    if(this.isRemoved()){
      throw RemovedException.VIEW_CONTAINER(this._ID)
    }
    return this.stores().listen(store, (payload, type) => {
      if (!this.isRemoved()) {
        clb.call(null, payload.data())
      }
    },100,guard)
  }

  /**
   * @callback ViewContainer~storeChanged
   * @param {StoreState} state
   * @return {boolean}
   */

  #mountViews() {
    this.views().forEach((view, key, map) => {
      view.mountInto(this.parentNode)
    })
  }

  #renderViews() {
    this.views().forEach((view, key, map) => {
      view.render()
    })
  }

  /**
   * @description Render all views
   */
  render() {
    if(this.isRemoved()){
      throw RemovedException.VIEW_CONTAINER(this._ID)
    }
    this.#renderViews()
    this._rendered = true
  }

  updateViewsNode() {
    if(this.isRemoved()){
      throw RemovedException.VIEW_CONTAINER(this._ID)
    }
    this.views().forEach((view, key, map) => {
      view.updateNode()
    })
  }

  /**
   * @return {Element} parentNode
   */
  mount() {
    if(this.isRemoved()){
      throw RemovedException.VIEW_CONTAINER(this._ID)
    }
    this.#mountViews()
    this._mounted = true

    return this.parentNode
  }

  /**
   * @param {Element} element
   * @return {Element}
   */
  mountInto(element) {
    this.parentNode = element
    return this.mount()
  }

  /**
   * @return {Element} parentNode
   */
  renderAndMount() {
    this.#logger.info('Render And Mount : ' + this.ID())

    this.render()
    return this.mount()
  }

  /**
   * @return {ViewContainer}
   */
  unMount() {
    this.views().forEach(
      /**
       * @param {View} v
       */
      v => {
        v.unMount()
      })

    this._mounted = false

    return this
  }

  /**
   * @return {string}
   */
  AppID() {
    return this.#config.componentContext().APP().ID()
  }

  /**
   * @return {string}
   */
  componentID() {
    return this.#config.componentContext().ID()
  }

  /**
   * @return {ViewRenderConfig}
   */
  viewRenderConfig() {
    return this.#config.componentContext().APP().viewRenderConfig()
  }


  /**
   * @return {SchedulerHandler}
   */
  scheduler() {
    return this.#config.componentContext().scheduler()
  }

  /**
   * @return {ViewContainerPublicEventHandler}
   */
  on() {
    return new ViewContainerPublicEventHandler(a => this._on(a))
  }

  remove() {
    this.#logger.info('Remove : ' + this.ID())

    this.dispatch(ViewContainerPublicEventHandler.WILL_REMOVE, null)

    super.remove()
    this.#config.componentContext().viewContainers().detach(this)
  }
}

export class ViewContainerParameters {
  /**
   * @type {ComponentContext}
   */
  #componentContext
  /**
   * @type {string}
   */
  #id
  /**
   * @type {Element}
   */
  #parentNode

  /**
   * @param {ComponentContext} componentContext
   * @param {string} id
   * @param {Element} parentNode
   * @return ViewContainerParameters
   */
  constructor(componentContext, id, parentNode) {
    this.#componentContext = TypeCheck.assertIsComponentContext(componentContext)
    this.#id = TypeTypeCheck.assertIsString(id)
    this.#parentNode = TypeTypeCheck.assertIsNode(parentNode)
  }

  /**
   * @return {ComponentContext}
   */
  componentContext() {
    return this.#componentContext
  }

  /**
   * @return {string}
   */
  id() {
    return this.#id
  }

  /**
   * @return {Element}
   */
  parentNode() {
    return this.#parentNode
  }
}
