'use strict'
import {CLASS_TAG_NAME} from './CLASS_TAG_NAME'
import {isNode, isString, assert, isIterable} from 'flexio-jshelpers'
import {
  View,
  STORE_CHANGED as VIEW_STORE_CHANGED
} from './View'
import {
  Store,
  CHANGED as STORE_CHANGED
} from './storeBases/Store'
import {ViewContainerBase} from './bases/ViewContainerBase'
import {CoreException} from './CoreException'

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
      /**
         * @property {String}
         * @name ViewContainerParameters#id
         */
      id: {
        configurable: false,
        enumerable: false,
        writable: false,
        value: id
      },
      /**
         * @property {Node}
         * @name ViewContainerParameters#parentNode
         */
      parentNode: {
        value: parentNode
      }
    }
    )
  }
}

export const INIT = 'INIT'
export const STORE_CHANGE = 'STORE_CHANGE'
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
   */
  constructor(viewContainerParameters) {
    assert(viewContainerParameters instanceof ViewContainerParameters,
      'hotballoon:ViewContainer:constructor: `viewContainerParameters` argument assert be an instance of ViewContainerParameters'
    )

    super(viewContainerParameters.id)
    this.parentNode = viewContainerParameters.parentNode
    this.debug.color = 'blueDark'

    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: '__HB__VIEWCONTAINER__'
    })

    Object.defineProperties(this, {
      /**
       * @property {Component}
       * @name ViewContainer#_Component
       * @protected
       */
      _Component: {
        configurable: false,
        enumerable: false,
        writable: false,
        value: viewContainerParameters.component
      }
    })

    this._registerStores()
    this.registerViews()
  }

  registerViews() {
    throw new CoreException('registerViews should be overided', 'METHOD_NOT_OVERIDED')
  }

  /**
   * @description Format an Event name
   * @private
   * @param {String} storeKey : store token
   * @param {String}  event : event types
   * @return {string} event name formated
   */
  _formatStoreEventName(storeKey, type) {
    return storeKey + '_' + type
  }

  /**
   *
   * @param {String} storeKey : store token
   * @param {String}  event : event types
   */
  subscribeToStore(store, event = STORE_CHANGED) {
    assert(store instanceof Store,
      'hotballoon:ViewContainer:subscribeToStore: `store` const should be an instance of StoreBase ')

    store.subscribe(
      event,
      (payload, type) => {
        this.dispatch(this._formatStoreEventName(store._ID, type), payload)
      },
      this,
      100
    )
  }

  /**
   * @private
   */
  _registerStores() {
    this._Stores.forEach((store, key, map) => {
      this.subscribeToStore(store)
    })
  }

  /**
   * @param {hotballoon/View} view
   * @param {iterable<Store>} stores : stores instances
   */
  suscribeToStoreEvent(view, stores) {
    assert(isIterable(stores),
      'hotballoon:ViewContainer:addView: `stores` argument should be iterable')
    stores.forEach((store) => {
      assert(store instanceof Store,
        'hotballoon:ViewContainer:_suscribeToStoreEvent: `store` argument should be qan instance of Hotballoon/Store')
      this._suscribeToEvent(view, store, STORE_CHANGED)
    })
  }

  /**
   *
   * @private
   * @param {String} key : event token
   * @param {String} storeKey : store token
   * @param {String} storeEvent : event name
   * @param {hotballoon/View} view
   * @param {Integer} priority
   */
  _suscribeToEvent(view, store, event, priority = 0) {
    this.debug.log('_suscribeToEvent')
    this.debug.log(this._formatStoreEventName(store._ID, event))
    this.debug.print()

    const token = this.addEventListener(
      this._formatStoreEventName(store._ID, event),
      (payload, type) => {
        view.dispatch(VIEW_STORE_CHANGED, payload)
      },
      view,
      priority
    )
    this._tokenEvent.add(store._ID + '-' + view._ID, token)
  }

  /**
   * @private
   * @param {Node} parentNode
   */
  _renderViewsAndMount(parentNode) {
    this._Views.forEach((view, key, map) => {
      view.renderAndMount(parentNode)
    })
  }

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
   * @return {Action} action
   * @instance
   */
  Action(key) {
    return this.Component().Action(key)
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
   * @returns {hStore} Store
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
