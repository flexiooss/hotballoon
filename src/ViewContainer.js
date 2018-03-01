import {
  View
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

/**
 * @class
 * ViewContainer is a Views container who can suscribe to Stores to dispatch state to Views
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
      'hoballoon:ViewContainer:subscribeToStore: `storesKey` argument assert be an instance of Map ')

    this.storesKey = storesKey
    this._registerStores()

    this._views = new MapOfInstance(View)
    this._mounted = false
    this._rendered = false

    Object.defineProperty(this, '_EventHandler', {
      enumerable: false,
      configurable: false,
      value: EVENT_HANDLER
    })
    this._tokenEvent = new MapOfArray()
    this.registerViews()
  }

  init() {
    this.mount()
  }

  /**
     *
     * --------------------------------------------------------------
     * EventHandler
     * --------------------------------------------------------------
     */

  static eventType(key) {
    const types = {
      INIT: 'INIT',
      STORE_CHANGE: 'STORE_CHANGE',
      WILL_REMOVE: 'WILL_REMOVE'
    }
    return (key) ? types[key] : types
  }

  _formatStoreEventName(storeKey, type) {
    return storeKey + '_' + type
  }

  subscribe(type, callback, scope, priority) {
    return this._EventHandler.addEventListener(type, callback, scope, priority)
  }

  dispatch(eventType, payload) {
    console.log('ViewContainer:dispatch')
    this._EventHandler.dispatch(eventType, payload)
  }

  /**
     *
     * --------------------------------------------------------------
     * Stores
     * --------------------------------------------------------------
     */

  subscribeToStore(storeKey, event) {
    let store = this.Store(storeKey)

    // console.log('subscribeToStore')
    // console.log(store)
    // console.log(storeKey)
    // console.log(event)
    assert(store instanceof Store,
      'hoballoon:ViewContainer:subscribeToStore: `store` argument assert be an instance of StoreBase ')

    store.subscribe(event,
      (payload, type) => {
        this.dispatch(this._formatStoreEventName(storeKey, type), payload)
      },
      this, 100)
  }

  _registerStores() {
    this.storesKey.forEach((value, key, map) => {
      this.subscribeToStore(value, Store.eventType('CHANGED'))
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
     * @param {*} view
     * @param {*} key
     * @param {array} events , array of event types
     */
  addView(view, storeKey, storeEvent) {
    this._views.add(view._ID, view)
    if (storeKey && storeEvent) {
      this._suscribeToEvent(view._ID, storeKey, storeEvent, view)
    }
    return view
  }

  _suscribeToEvent(key, storeKey, storeEvent, view) {
    var eventName = this._formatStoreEventName(storeKey, storeEvent)

    let token = this.subscribe(
      eventName,
      (payload, type) => {
        view.dispatch(View.eventType('STORE_CHANGED'), payload)
      },
      view, 0)
    this._tokenEvent.add(key, token)
  }

  replaceView(view, key) {
    this._views.replace(view, key)
  }

  view(key) {
    return this._views.get(key)
  }

  /**
     *
     * --------------------------------------------------------------
     * Rendering
     * --------------------------------------------------------------
     */

  _renderViews(parentNode) {
    this._views.forEach((view, key, map) => {
      view.renderAndMount(parentNode)
    })
  }

  render(parentNode) {
    assert(isNode(parentNode),
      'hotballoon:ViewContainer:mount: `parentNode` arguement assert be a NodeElement, %s given',
      typeof parentNode)
    this._renderViews(parentNode)
    this._rendered = true
    return parentNode
  }

  /**
     *
     * --------------------------------------------------------------
     * Actions
     * --------------------------------------------------------------
     */
  createAction(action, typAction, payload) {
    action.newAction(typAction, payload)
  }

  newViewAction(actionName, clb, ...args) {
    this.createAction(actionName, clb, ...args)
  }
}

export {
  ViewContainer
}
