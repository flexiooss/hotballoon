'use strict'
import { CLASS_TAG_NAME } from './CLASS_TAG_NAME'
import { EventOrderedHandler } from './EventOrderedHandler'
import { MapOfInstance, MapOfArray, isNode, isString, isBoolean, assert, isIterable } from 'flexio-jshelpers'
import { ComponentContextMixin } from './mixins/ComponentContextMixin'
import { RequireIDMixin } from './mixins/RequireIDMixin'
import { PrivateStateMixin } from './mixins/PrivateStateMixin'
import {
  View,
  STORE_CHANGED as VIEW_STORE_CHANGED
} from './View'
import {
  Store,
  CHANGED as STORE_CHANGED
} from './storeBases/Store'

export class ViewContainerParameters {
  constructor(componentInst, id, parentNode, mapOfStores) {
    assert(!!isString(id),
      'hoballoon:ViewContainerParameters: `id` argument assert be a String'
    )
    assert(!!isNode(parentNode),
      'hotballoon:View:ViewContainerParameters: `parentNode` argument should be a NodeElement'
    )
    assert(mapOfStores instanceof Map,
      'hoballoon:ViewContainerParameters: `mapOfStores` argument assert be an instance of Map'
    )

    Object.defineProperties(this, {
      component: {
        value: componentInst
      },
      id: {
        configurable: false,
        enumerable: false,
        writable: false,
        value: id
      },
      parentNode: {
        value: parentNode
      },
      mapOfStores: {
        value: mapOfStores
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
 * @extends hotballoon/ComponentContextMixin
 * @extends hotballoon/RequireIDMixin
 * @extends hotballoon/PrivateStateMixin
 *
 */
export class ViewContainer extends ComponentContextMixin(RequireIDMixin(PrivateStateMixin(class { }))) {
  // constructor(component, id, parentNode, storesRegistered = new Map()) {
  constructor(viewContainerParameters) {
    assert(viewContainerParameters instanceof ViewContainerParameters,
      'hoballoon:ViewContainer:constructor: `viewContainerParameters` argument assert be an instance of ViewContainerParameters'
    )
    super()
    this.ComponentContextMixinInit(viewContainerParameters.component)
    this.RequireIDMixinInit(viewContainerParameters.id)
    this.PrivateStateMixinInit()

    const EVENT_HANDLER = Object.seal(new EventOrderedHandler())
    var _mounted = false
    var _rendered = false
    var _tokenEvent = new MapOfArray()
    var _views = new MapOfInstance(View)

    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: '__HB__VIEWCONTAINER__'
    })

    Object.defineProperties(this, {
      storesRegistered: {
        configurable: false,
        enumerable: true,
        writable: false,
        value: viewContainerParameters.mapOfStores
      },
      _mounted: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _mounted
        },
        set: (v) => {
          assert(!!isBoolean(v),
            'hotballoon:ViewContainer:constructor: `_mounted` argument should be a boolean'
          )
          _mounted = v
        }
      },
      _rendered: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _rendered
        },
        set: (v) => {
          assert(!!isBoolean(v),
            'hotballoon:ViewContainer:constructor: `_rendered` argument should be a boolean'
          )
          _rendered = v
        }
      },
      '_EventHandler': {
        enumerable: false,
        configurable: false,
        value: EVENT_HANDLER
      },
      '_tokenEvent': {
        enumerable: false,
        configurable: false,
        value: _tokenEvent
      },
      '_views': {
        enumerable: false,
        configurable: false,
        value: _views
      },
      parentNode: {
        configurable: false,
        enumerable: true,
        writable: false,
        value: viewContainerParameters.parentNode
      }
    })

    this._registerStores()
    this.registerViews()
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
   * @description Suscribe to _EventHandler event
   * @param {String} event
   * @param {Function} callback
   * @param {Object} scope
   * @param {Integer}  priority
   * @returns {String} token
   */
  subscribe(type, callback, scope, priority) {
    return this._EventHandler.addEventListener(type, callback, scope, priority)
  }

  /**
   * @description dispatch _EventHandler event
   * @param {String} eventType
   * @param {Object} payload
   */
  dispatch(eventType, payload) {
    console.log('%c ViewContainer:dispatch: ' + eventType, 'background: #eee; color: red')

    this._EventHandler.dispatch(eventType, payload)
  }

  /**
   *
   * --------------------------------------------------------------
   * Stores
   * --------------------------------------------------------------
   */

  /**
   *
   * @param {String} storeKey : store token
   * @param {String}  event : event types
   */
  subscribeToStore(store, event = STORE_CHANGED) {
    assert(store instanceof Store,
      'hoballoon:ViewContainer:subscribeToStore: `store` const should be an instance of StoreBase ')

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
    this.storesRegistered.forEach((store, key, map) => {
      this.subscribeToStore(store)
    })
  }

  /**
   *
   * --------------------------------------------------------------
   * Views
   * --------------------------------------------------------------
   */

  /**
   *
   * @param {hotballoon/View} view
   * @param {Iterable} stores : stores token
   * @param {String}  storeEvent event types
   */
  addView(view, stores = new Set()) {
    this._views.add(view._ID, view)
    this.suscribeToStoreEvent(view, stores)
    return view
  }

  /**
   * @param {hotballoon/View} view
   * @param {Iterable} stores : stores instances
   */
  suscribeToStoreEvent(view, stores) {
    assert(isIterable(stores),
      'hoballoon:ViewContainer:addView: `stores` argument should be iterable')
    stores.forEach((store) => {
      assert(store instanceof Store,
        'hoballoon:ViewContainer:_suscribeToStoreEvent: `store` argument should be qan instance of Hotballoon/Store')
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
    console.log('_suscribeToEvent')
    console.log(this._formatStoreEventName(store._ID, event))

    const token = this.subscribe(
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
   *
   * @param {hotballoon/View} view
   * @param {String} key : View token
   */
  replaceView(view, key) {
    this._views.replace(view, key)
  }

  /**
   *
   * @param {String} key : View token
   * @return {hotballoon/View} View
   */
  View(key) {
    return this._views.get(key)
  }

  /**
   *
   * --------------------------------------------------------------
   * Rendering
   * --------------------------------------------------------------
   */

  /**
   * @private
   * @param {NodeElement} parentNode
   */
  _renderViewsAndMount(parentNode) {
    this._views.forEach((view, key, map) => {
      view.renderAndMount(parentNode)
    })
  }

  /**
   * @private
   * @param {NodeElement} parentNode
   */
  _mountViews(parentNode) {
    this._views.forEach((view, key, map) => {
      view.mount(parentNode)
    })
  }

  /**
   * @private
   */
  _renderViews() {
    this._views.forEach((view, key, map) => {
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
   * @param {NodeElement} parentNode
   * @returns {NodeElement} parentNode
   */
  mount(parentNode) {
    assert(isNode(parentNode),
      'hotballoon:ViewContainer:mount: `parentNode` arguement assert be a NodeElement, %s given',
      typeof parentNode)
    this._mountViews(parentNode)
    this._mounted = true

    return parentNode
  }

  /**
   * Render all views and mount these into the `parentNode` argument
   * @param {NodeElement} parentNode
   * @returns {NodeElement} parentNode
   */
  renderAndMount(parentNode) {
    console.log('%c ViewContainer:renderAndMount ', 'background: red; color: white; font-size:16px')

    this.render()
    this.mount(parentNode)
    return parentNode
  }
}
