'use strict'
import {CLASS_TAG_NAME, CLASS_TAG_NAME_VIEWCONTAINER} from '../CLASS_TAG_NAME'
import {isNode, isString, assert, isFunction} from 'flexio-jshelpers'
import {CHANGED as STORE_CHANGED, StoreInterface} from '../Store/StoreInterface'
import {ViewContainerBase} from './ViewContainerBase'
import {CoreException} from '../CoreException'
import {Action} from '../Action/Action'

export class ViewContainerParameters {
  /**
   *
   * @param {Component} componentInst
   * @param {string} id
   * @param {Node} parentNode
   * @return ViewContainerParameters
   */
  constructor(componentInst, id, parentNode) {
    assert(!!isString(id),
      'hotballoon:ViewContainerParameters: `id` argument assert be a String'
    )
    assert(!!isNode(parentNode),
      'hotballoon:View:ViewContainerParameters: `parentNode` argument should be a Node'
    )

    Object.defineProperties(this, {
      /**
         * @property {Component} component
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

/**
 *
 * @class
 * @description ViewContainer is a Views container who can suscribe to Stores to dispatch state to Views
 * @extends ViewContainerBase
 *
 */
export class ViewContainer extends ViewContainerBase {
  /**
   *
   * @param {ViewContainerParameters} viewContainerParameters
   * @param {ViewStoresParameters} stores
   */
  constructor(viewContainerParameters, stores) {
    assert(viewContainerParameters instanceof ViewContainerParameters,
      'hotballoon:ViewContainer:constructor: `viewContainerParameters` argument assert be an instance of ViewContainerParameters'
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
      _Component: {
        configurable: false,
        enumerable: false,
        writable: false,
        /**
         * @type {Component}
         * @name ViewContainer#_Component
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
   * @param {updateCallback} clb : event name
   */
  _suscribeToStore(keyStore, clb = (payload) => {
  }) {
    assert(isFunction(clb), 'hotballoon:' + this.constructor.name + ':_suscribeToStore: `clb` argument should be callable')
    const store = this._Store(keyStore)
    assert(store instanceof StoreInterface, 'hotballoon:' + this.constructor.name + ':_suscribeToStore: `keyStore : %s` not reference an instance of StoreInterface', keyStore)

    this._tokenEvent.add(
      store._ID,
      store.subscribe(
        STORE_CHANGED,
        (payload, type) => {
          clb(payload)
        },
        this,
        100
      )
    )
    /**
     *
     * @callback updateCallback
     * @param {Object} oldState
     * @param {Object} newState
     */
  }

  // /**
  //  * @param {hotballoon/View} view
  //  * @param {iterable<Store>} stores : stores instances
  //  */
  // suscribeToStoreEvent(view, stores) {
  //   assert(isIterable(stores),
  //     'hotballoon:ViewContainer:addView: `stores` argument should be iterable')
  //   stores.forEach((store) => {
  //     assert(store instanceof Store,
  //       'hotballoon:ViewContainer:_suscribeToStoreEvent: `store` argument should be qan instance of Hotballoon/Store')
  //     this._suscribeToEvent(view, store, STORE_CHANGED)
  //   })
  // }
  //
  // /**
  //  *
  //  * @private
  //  * @param {String} key : event token
  //  * @param {String} storeKey : store token
  //  * @param {String} storeEvent : event name
  //  * @param {hotballoon/View} view
  //  * @param {Integer} priority
  //  */
  // _suscribeToEvent(view, store, event, priority = 0) {
  //   this.debug.log('_suscribeToEvent')
  //   this.debug.log(this._formatStoreEventName(store._ID, event))
  //   this.debug.print()
  //
  //   const token = this.addEventListener(
  //     this._formatStoreEventName(store._ID, event),
  //     (payload, type) => {
  //       view.dispatch(VIEW_STORE_CHANGED, payload)
  //     },
  //     view,
  //     priority
  //   )
  //   this._tokenEvent.add(store._ID + '-' + view._ID, token)
  // }

  // /**
  //  * @private
  //  * @param {Node} parentNode
  //  */
  // _renderViewsAndMount(parentNode) {
  //   this._Views.forEach((view, key, map) => {
  //     view.renderAndMount(parentNode)
  //   })
  // }

  /**
   * @private
   * @param {Node} parentNode
   */
  _mountViews(parentNode) {
    this._Views.forEach((view, key, map) => {
      view.mount(parentNode)
    })
  }

  /**
   * @private
   */
  _renderViews() {
    this._Views.forEach((view, key, map) => {
      view.render()
    })
  }

  /**
   * @description Render all views
   */
  render() {
    this._renderViews()
    this._rendered = true
  }

  /**
   * Mount all views into the `parentNode` argument
   * @param {Node} parentNode
   * @return {Node} parentNode
   */
  mount(parentNode) {
    assert(isNode(parentNode),
      'hotballoon:ViewContainer:mount: `parentNode` arguement assert be a Node, %s given',
      typeof parentNode)
    this._mountViews(parentNode)
    this._mounted = true

    return parentNode
  }

  /**
   * Render all views and mount these into the `parentNode` argument
   * @param {Node} parentNode
   * @return {Node} parentNode
   */
  renderAndMount(parentNode) {
    this.debug.log('renderAndMount').background().size(2)
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
    action.dispatchWith(this.Dispatcher())
  }

  /**
   *
   * @return {Component}
   * @constructor
   */
  Component() {
    return this._Component
  }

  /**
   * @return {HotBalloonApplication} hotBallonApplication
   * @instance
   */
  APP() {
    return this.Component().APP()
  }

  /**
   * @return {Dispatcher} dispatcher
   * @instance
   */
  Dispatcher() {
    return this.APP().Dispatcher()
  }

  /**
   * @param {String} key
   * @return {Service} service
   * @instance
   */
  Service(key) {
    return this.APP().Service(key)
  }

  /**
   * @param {String} key
   * @return {Store} store
   * @instance
   */
  Store(key) {
    return this.Component().Store(key)
  }

  /**
   *
   * @param {string} key token registered into storesKey
   * @returns {Store} Store
   */
  StoreByRegister(key) {
    return this.Component().StoreByRegister(key)
  }

  /**
   *
   * @param {string} key token registered into storesKey
   * @returns {Store} Store
   */
  StoreDataByRegister(key) {
    return this.Component().StoreDataByRegister(key)
  }
}
