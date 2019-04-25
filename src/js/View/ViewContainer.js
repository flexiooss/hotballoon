'use strict'
import {CLASS_TAG_NAME, CLASS_TAG_NAME_VIEWCONTAINER} from '../HasTagClassNameInterface'
import {isNode, isString, assert, assertType, isFunction} from 'flexio-jshelpers'
import {STORE_CHANGED, StoreInterface} from '../Store/StoreInterface'
import {ViewContainerBase} from './ViewContainerBase'
import {EventListenerOrderedBuilder} from '../Event/EventListenerOrderedBuilder'
import {ViewContainerPublicEventHandler} from './ViewContainerPublicEventHandler'

export class ViewContainerParameters {
  /**
   *
   * @param {componentContext} componentInst
   * @param {string} id
   * @param {Node} parentNode
   * @return ViewContainerParameters
   */
  constructor(componentInst, id, parentNode) {
    assertType(!!isString(id),
      'hotballoon:ViewContainerParameters: `id` argument assert be a String'
    )
    assertType(!!isNode(parentNode),
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
   */
  constructor(viewContainerParameters) {
    assert(viewContainerParameters instanceof ViewContainerParameters,
      'hotballoon:viewContainer:constructor: `viewContainerParameters` argument assert be an instance of ViewContainerParameters'
    )

    super(viewContainerParameters.id)
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
         * @params {ComponentContext}
         * @name ViewContainer#_ComponentContext
         * @protected
         */
        value: viewContainerParameters.component
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
   */
  subscribeToStore(store, clb = (state) => true) {
    assert(isFunction(clb), 'hotballoon:' + this.constructor.name + ':subscribeToStore: `clb` argument should be callable')

    assert(store instanceof StoreInterface, 'hotballoon:' + this.constructor.name + ':subscribeToStore: `keyStore : %s` not reference an instance of StoreInterface', store)

    this._tokenEvent.add(
      store.ID,
      store.subscribe(
        EventListenerOrderedBuilder
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
   * @param {StoreState} state
   * @return {boolean}
   */

  /**
   * @private
   */
  [_mountViews]() {
    this.MapOfView().forEach((view, key, map) => {
      view.mount(this.parentNode)
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
   * @return {Node} parentNode
   */
  mount() {
    this[_mountViews]()
    this._mounted = true

    return this.parentNode
  }

  /**
   * @return {Node} parentNode
   */
  renderAndMount() {
    this.debug.log('render And Mount').background().size(2)
    this.debug.print()

    this.render()
    return this.mount()
  }

  /**
   * @param {String} key
   * @return {service}
   * @instance
   */
  service(key) {
    return this._ComponentContext.APP().service(key)
  }

  /**
   *
   * @return {string}
   */
  AppID() {
    return this._ComponentContext.APP().ID
  }

  /**
   *
   * @return {string}
   */
  componentID() {
    return this._ComponentContext.ID
  }

  /**
   *
   * @return {ViewContainerPublicEventHandler}
   */
  on() {
    return new ViewContainerPublicEventHandler(a => this._on(a))
  }
}
