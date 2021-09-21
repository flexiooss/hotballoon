import {CLASS_TAG_NAME, CLASS_TAG_NAME_VIEWCONTAINER} from '../Types/HasTagClassNameInterface'
import {
  assertInstanceOf,
  TypeCheck as TypeTypeCheck
} from '@flexio-oss/js-commons-bundle/assert'
import {StoreInterface} from '../Store/StoreInterface'
import {ViewContainerBase} from './ViewContainerBase'
import {ViewContainerPublicEventHandler} from './ViewContainerPublicEventHandler'
import {TypeCheck} from '../Types/TypeCheck'
import {RemovedException} from "../Exception/RemovedException";

const viewContainerLogOptions = {
  color: 'blueDark',
  titleSize: 2
}

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
   * @param {ViewContainerParameters} config
   */
  constructor(config) {
    assertInstanceOf(config, ViewContainerParameters, 'ViewContainerParameters')
    super(config.id(), config.componentContext().logger())
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
   * @return {ListenedStore}
   */
  subscribeToStore(store, clb = (state) => true) {
    if(this.isRemoved()){
      throw RemovedException.VIEW_CONTAINER(this._ID)
    }
    return this.stores().listen(store, (payload, type) => {
      if (!this.isRemoved()) {
        clb.call(null, payload.data())
      }
    })
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
    this.logger().log(
      this.logger().builder()
        .info()
        .pushLog('Render And Mount : ' + this.ID())
        .pushLog(this),
      viewContainerLogOptions
    )

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
   * @return {ViewContainerPublicEventHandler}
   */
  on() {
    return new ViewContainerPublicEventHandler(a => this._on(a))
  }

  remove() {
    this.logger().log(
      this.logger().builder()
        .info()
        .pushLog('Remove : ' + this.ID())
        .pushLog(this),
      viewContainerLogOptions
    )

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
