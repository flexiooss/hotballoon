'use strict'
import {CLASS_TAG_NAME, CLASS_TAG_NAME_VIEWCONTAINER} from '../HasTagClassNameInterface'
import {isNode, isString, assert, isFunction} from 'flexio-jshelpers'
import {STORE_CHANGED, StoreInterface} from '../Store/StoreInterface'
import {ViewContainerBase} from './ViewContainerBase'
import {CoreException} from '../CoreException'
import {Action} from '../Action/Action'
import {EventListenerOrderedFactory} from '../Event/EventListenerOrderedFactory'

export class ViewContainerParameters {
  /**
   *
   * @param {componentContext} componentInst
   * @param {string} id
   * @param {Node} parentNode
   * @return ViewContainerParameters
   */
  constructor(componentInst, id, parentNode) {
    assert(!!isString(id),
      'hotballoon:ViewContainerParameters: `id` argument assert be a String'
    )
    assert(!!isNode(parentNode),
      'hotballoon:view:ViewContainerParameters: `parentNode` argument should be a Node'
    )

    Object.defineProperties(this, {
      /**
         * @property {componentContext} component
         * @name ViewContainerParameters#component
         */
      component: {
        value: componentInst
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
           * @property {Node}
           * @name ViewContainerParameters#parentNode
           */
        value: parentNode
      }
    }
    )
  }
}

export const WILL_REMOVE = 'WILL_REMOVE'
const _renderViews = Symbol('_renderViews')
const _mountViews = Symbol('_mountViews')

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
   * @param {ViewStoresParameters} stores
   */
  constructor(viewContainerParameters, stores) {
    assert(viewContainerParameters instanceof ViewContainerParameters,
      'hotballoon:viewContainer:constructor: `viewContainerParameters` argument assert be an instance of ViewContainerParameters'
    )

    super(viewContainerParameters.id, stores)
    this.parentNode = viewContainerParameters.parentNode
    this.debug.color = 'blueDark'

    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_VIEWCONTAINER
    })

    Object.defineProperties(this, {
      _ComponentContext: {
        configurable: false,
        enumerable: false,
        writable: false,
        /**
         * @type {ComponentContext}
         * @name ViewContainer#_ComponentContext
         * @protected
         */
        value: viewContainerParameters.component
      }
    })

    this.registerViews()
  }

  registerViews() {
    throw new CoreException('registerViews should be override', 'METHOD_NOT_OVERRIDE')
  }

  /**
   *
   * @description subscribe subView an event of this view
   * @param {String} keyStore
   * @param {ViewContainer~storeChanged} clb
   */
  suscribeToStore(keyStore, clb = (state) => true) {
    assert(isFunction(clb), 'hotballoon:' + this.constructor.name + ':suscribeToStore: `clb` argument should be callable')

    const store = this.store(keyStore)

    assert(store instanceof StoreInterface, 'hotballoon:' + this.constructor.name + ':suscribeToStore: `keyStore : %s` not reference an instance of StoreInterface', keyStore)

    this._tokenEvent.add(
      store.ID,
      store.subscribe(
        EventListenerOrderedFactory
          .listen(STORE_CHANGED)
          .callback((payload, type) => {
            clb(payload.data)
          })
          .build()
      )
    )
  }

  /**
   *
   * @callback ViewContainer~storeChanged
   * @param {Object} state
   * @return {boolean}
   */

  /**
   * @private
   * @param {Node} parentNode
   */
  [_mountViews](parentNode) {
    this.MapOfView().forEach((view, key, map) => {
      view.mount(parentNode)
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
    this.rendered = true
  }

  /**
   * Mount all views into the `parentNode` argument
   * @param {Node} parentNode
   * @return {Node} parentNode
   */
  mount(parentNode) {
    assert(isNode(parentNode),
      'hotballoon:viewContainer:mount: `parentNode` argument assert be a Node, %s given',
      typeof parentNode)
    this[_mountViews](parentNode)
    this._mounted = true

    return parentNode
  }

  /**
   * Render all views and mount these into the `parentNode` argument
   * @param {Node} parentNode
   * @return {Node} parentNode
   */
  renderAndMount(parentNode) {
    this.debug.log('render And Mount').background().size(2)
    this.debug.print()

    this.render()
    this.mount(parentNode)
    return parentNode
  }

  /**
   * @param {Action} action
   */
  dispatchAction(action) {
    assert(action instanceof Action,
      'hotballoon:' + this.constructor.name + ':addAction: `action` argument should be an instance of Action'
    )
    action.dispatchWith(this.dispatcher())
  }

  /**
   *
   * @return {ComponentContext}
   * @constructor
   */
  componentContext() {
    return this._ComponentContext
  }

  /**
   * @return {HotBalloonApplication}
   * @instance
   */
  APP() {
    return this.componentContext().APP()
  }

  /**
   * @return {Dispatcher} dispatcher
   * @instance
   */
  dispatcher() {
    return this.APP().dispatcher()
  }

  /**
   * @param {String} key
   * @return {service}
   * @instance
   */
  service(key) {
    return this.APP().service(key)
  }
}
