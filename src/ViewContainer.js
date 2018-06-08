'use strict'
import { EventOrderedHandler } from './EventOrderedHandler'
import { MapOfInstance, MapOfArray, isNode, isBoolean, assert, isIterable } from 'flexio-jshelpers'
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

const EVENT_HANDLER = Object.seal(new EventOrderedHandler())

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
class ViewContainer extends ComponentContextMixin(RequireIDMixin(PrivateStateMixin(class { }))) {
  constructor(component, id, parentNode, storeKeysRegistered = new Map()) {
    super()
    /**
     * MixinInit
     */
    this.ComponentContextMixinInit(component)
    this.RequireIDMixinInit(id)
    this.PrivateStateMixinInit()

    assert(storeKeysRegistered instanceof Map,
      'hoballoon:ViewContainer:subscribeToStore: `storeKeysRegister` argument assert be an instance of Map'
    )
    assert(!!isNode(parentNode),
      'hotballoon:View:constructor: `parentNode` argument should be a NodeElement'
    )

    var _mounted = false
    var _rendered = false
    var _tokenEvent = new MapOfArray()
    var _views = new MapOfInstance(View)

    Object.defineProperties(this, {
      '__HB__CLASSNAME__': {
        configurable: false,
        writable: false,
        enumerable: true,
        value: '__HB__VIEWCONTAINER__'
      },
      storeKeysRegistered: {
        configurable: false,
        enumerable: true,
        writable: false,
        value: storeKeysRegistered
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
        get: () => {
          return parentNode
        },
        set: (v) => {
          assert(!!isNode(v),
            'hotballoon:View:constructor: `parentNode` argument should be a NodeElement'
          )
          parentNode = v
        }
      }
    })

    this._registerStores()
    this.registerViews()
  }

  /**
   *
   * --------------------------------------------------------------
   * EventHandler
   * --------------------------------------------------------------
   */

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
  subscribeToStore(storeKey, event) {
    const store = this.Store(storeKey)
    assert(store instanceof Store,
      'hoballoon:ViewContainer:subscribeToStore: `store` argument assert be an instance of StoreBase ')

    store.subscribe(event,
      (payload, type) => {
        this.dispatch(this._formatStoreEventName(storeKey, type), payload)
      },
      this, 100)
  }

  /**
   * @private
   */
  _registerStores() {
    this.storeKeysRegistered.forEach((value, key, map) => {
      this.subscribeToStore(value, STORE_CHANGED)
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
    this._suscribeToStoreEvent(view, stores)
    return view
  }

  /**
   * @private
   * @param {hotballoon/View} view
   * @param {Iterable} stores : stores token
   */
  _suscribeToStoreEvent(view, stores) {
    assert(isIterable(stores),
      'hoballoon:ViewContainer:addView: `stores` argument should be iterable')
    stores.forEach((store) => {
      view.props.set(store._ID, store.state())
      this._suscribeToEvent(view._ID, store._ID, STORE_CHANGED, view)
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
  _suscribeToEvent(key, storeKey, storeEvent, view, priority = 0) {
    const eventName = this._formatStoreEventName(storeKey, storeEvent)
    const token = this.subscribe(
      eventName,
      (payload, type) => {
        view.dispatch(VIEW_STORE_CHANGED, payload)
      },
      view, priority)
    this._tokenEvent.add(key, token)
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
    this.render()
    this.mount(parentNode)
    return parentNode
  }
}

export {
  ViewContainer
}
