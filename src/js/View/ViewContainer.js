import {CLASS_TAG_NAME, CLASS_TAG_NAME_VIEWCONTAINER} from '../Types/HasTagClassNameInterface'
import {assertType, isFunction, isNode, isString} from '@flexio-oss/assert'
import {StoreInterface} from '../Store/StoreInterface'
import {ViewContainerBase} from './ViewContainerBase'
import {ViewContainerPublicEventHandler} from './ViewContainerPublicEventHandler'
import {TypeCheck} from '../Types/TypeCheck'

export class ViewContainerParameters {
  /**
   *
   * @param {ComponentContext} componentContext
   * @param {string} id
   * @param {Element} parentNode
   * @return ViewContainerParameters
   */
  constructor(componentContext, id, parentNode) {
    assertType(TypeCheck.isComponentContext(componentContext),
      'hotballoon:ViewContainerParameters: `componentContext` argument should be an instance of `ComponentContext`')

    assertType(!!isString(id),
      'hotballoon:ViewContainerParameters: `id` argument assert be a String'
    )
    assertType(!!isNode(parentNode),
      'hotballoon:view:ViewContainerParameters: `parentNode` argument should be a Node'
    )

    Object.defineProperties(this, {
        /**
         * @property {ComponentContext} componentContext
         * @name ViewContainerParameters#componentContext
         */
        componentContext: {
          value: componentContext
        },
        id: {
          configurable: false,
          enumerable: false,
          writable: false,
          /**
           * @property {String}
           * @name ViewContainerParameters#id
           */
          value: id
        },
        parentNode: {
          /**
           * @property {Element}
           * @name ViewContainerParameters#parentNode
           */
          value: parentNode
        }
      }
    )
  }
}

const _renderViews = Symbol('_renderViews')
const _mountViews = Symbol('_mountViews')
const _ComponentContext = Symbol('_ComponentContext')

const viewContainerLogOptions = {
  color: 'blueDark',
  titleSize: 2
}

/**
 *
 * @class
 * @description viewContainer is a Views container who can subscribe to Stores to dispatch state to Views
 * @extends ViewContainerBase
 * @implements HasTagClassNameInterface
 */
export class ViewContainer extends ViewContainerBase {
  /**
   *
   * @param {ViewContainerParameters} viewContainerParameters
   */
  constructor(viewContainerParameters) {
    assertType(viewContainerParameters instanceof ViewContainerParameters,
      'hotballoon:viewContainer:constructor: `viewContainerParameters` argument assert be an instance of ViewContainerParameters'
    )

    super(viewContainerParameters.id)
    this.parentNode = viewContainerParameters.parentNode

    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_VIEWCONTAINER
    })

    Object.defineProperties(this, {
      [_ComponentContext]: {
        configurable: false,
        enumerable: false,
        writable: false,
        /**
         * @params {ComponentContext}
         * @name ViewContainer#_ComponentContext
         * @protected
         */
        value: viewContainerParameters.componentContext
      }
    })
  }

  /**
   *
   * @callback ViewContainer~storeChanged
   * @param {Object} state
   * @return {boolean}
   */

  /**
   *
   * @description subscribe subView an events of this view
   * @param {StoreInterface} store
   * @param {ViewContainer~storeChanged} clb
   * @return {string}
   */
  subscribeToStore(store, clb = (state) => true) {
    assertType(isFunction(clb), 'hotballoon:' + this.constructor.name + ':subscribeToStore: `clb` argument should be callable')

    assertType(TypeCheck.isStoreBase(store), 'hotballoon:' + this.constructor.name + ':subscribeToStore: `keyStore : %s` not reference an instance of StoreInterface', store.constructor.name)

    const token = store.listenChanged(
      (payload, type) => {
        clb(payload.data())
      }
    )
    this._tokenEvent.push(
      store.storeId(),
      token
    )
    return token

  }

  /**
   *
   * @callback ViewContainer~storeChanged
   * @param {StoreState} state
   * @return {boolean}
   */

  /**
   * @private
   */
  [_mountViews]() {
    this.MapOfView().forEach((view, key, map) => {
      view.mountInto(this.parentNode)
    })
  }

  /**
   * @private
   */
  [_renderViews]() {
    this.MapOfView().forEach((view, key, map) => {
      view.render()
    })
  }

  /**
   * @description Render all views
   */
  render() {
    this[_renderViews]()
    this._rendered = true
  }

  /**
   * @return {Element} parentNode
   */
  mount() {
    this[_mountViews]()
    this._mounted = true

    return this.parentNode
  }

  /**
   *
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
   * @param {String} key
   * @return {?HotballoonService}
   * @instance
   */
  service(key) {
    return this[_ComponentContext].APP().service(key)
  }

  /**
   *
   * @return {string}
   */
  AppID() {
    return this[_ComponentContext].APP().ID()
  }

  /**
   *
   * @return {string}
   */
  componentID() {
    return this[_ComponentContext].ID()
  }

  /**
   *
   * @return {Document}
   */
  document() {
    return this[_ComponentContext].APP().document()
  }

  /**
   *
   * @return {LoggerInterface}
   */
  logger() {
    return this[_ComponentContext].logger()
  }

  /**
   *
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

    super.remove()
    this[_ComponentContext].removeViewContainerEntry(this.ID())

  }
}
