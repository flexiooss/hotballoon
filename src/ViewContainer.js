'use strict'
import {
  View,
  STORE_CHANGED as VIEW_STORE_CHANGED
} from './View'
import {
  EventOrderedHandler
} from './EventOrderedHandler'
import {
  Store
} from './storeBases/Store'
import {
  MapOfInstance,
  MapOfArray,
  isNode,
  isBoolean,
  assert
} from 'flexio-jshelpers'
import {
  ComponentContextMixin
} from './mixins/ComponentContextMixin'
import {
  RequireIDMixin
} from './mixins/RequireIDMixin'
import {
  PrivateStateMixin
} from './mixins/PrivateStateMixin'

const EVENT_HANDLER = Object.seal(new EventOrderedHandler())
const STORE_CHANGED = Store.eventType('CHANGED')
// const VIEW_STORE_CHANGED = View.eventType('STORE_CHANGED')
/**
 * @class
 * @description ViewContainer is a Views container who can suscribe to Stores to dispatch state to Views
 */
class ViewContainer extends ComponentContextMixin(RequireIDMixin(PrivateStateMixin(class {}))) {
  constructor(component, id, storesKey) {
    super()
    /**
         * MixinInit
         */
    this.ComponentContextMixinInit(component)
    this.RequireIDMixinInit(id)
    this.PrivateStateMixinInit()

    assert(storesKey instanceof Map,
      'hoballoon:ViewContainer:subscribeToStore: `storesKey` argument assert be an instance of Map'
    )

    this.storesKey = storesKey
    this._registerStores()

    var _mounted = false
    var _rendered = false
    var _tokenEvent = new MapOfArray()
    var _views = new MapOfInstance(View)

    Object.defineProperties(this, {
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
      }
    })

    this.registerViews()
  }

  /**
     *
     * --------------------------------------------------------------
     * EventHandler
     * --------------------------------------------------------------
     */

  /**
     * @static
     * @param {String} key
     * @returns {String|Object}
     */
  static eventType(key) {
    const types = {
      INIT: 'INIT',
      STORE_CHANGE: 'STORE_CHANGE',
      WILL_REMOVE: 'WILL_REMOVE'
    }
    return (key) ? types[key] : types
  }

  /**
     * @private
     * @param {String} storeKey : store token
     * @param {String}  event : event types
     */
  _formatStoreEventName(storeKey, type) {
    return storeKey + '_' + type
  }

  /**
     * @description suscribe to _EventHandler event
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
    this.storesKey.forEach((value, key, map) => {
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
     * @param {String} storeKey : store token
     * @param {String}  storeEvent event types
     */
  addView(view, storeKey, storeEvent) {
    this._views.add(view._ID, view)
    if (storeKey && storeEvent) {
      this._suscribeToEvent(view._ID, storeKey, storeEvent, view)
    }
    return view
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
     */
  view(key) {
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

  render() {
    this._renderViews()
    this._rendered = true
  }

  /**
     *
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
     *
     * @param {NodeElement} parentNode
     * @returns {NodeElement} parentNode
     */
  renderAndMount(parentNode) {
    this.render()
    this.mount(parentNode)
    return parentNode
  }

  /*
     *
     * --------------------------------------------------------------
     * Actions
     * --------------------------------------------------------------
     */

  /**
     * @param {hotballoon/Action} action
     * @param {String} typAction
     * @param {Object} payload
     *
     */
  createAction(Action, typAction, payload, ...args) {
    Action.newAction(typAction, payload, ...args)
  }

  /**
     *
     * @param {String} actionName
     * @param {Function} clb
     * @param {mixed} ...args
     */
  newViewAction(Action, clb, payload, ...args) {
    this.createAction(Action, clb, payload, ...args)
  }
}

export {
  ViewContainer
}
