import {
  View
} from './View'
import {
  EventOrderedHandler
} from './EventOrderedHandler'
import {
  StoreBase
} from './bases/StoreBase'
import {
  MapOfInstance,
  MapOfArray,
  isNode,
  should
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

const eventCallbackPrefix = 'on'
const viewSuscribeToEvents = 'StoreChanged'

/**
 * @class
 * ViewContainer is a Views container who can suscribe to Stores to dispatch state to Views
 */
class ViewContainer extends ComponentContextMixin(RequireIDMixin(PrivateStateMixin(class {}))) {
  constructor(component, id, storesKey) {
    super()
    this.ComponentContextMixinInit(component)
    this.RequireIDMixinInit(id)
    this.PrivateStateMixinInit()

    should(storesKey instanceof Map,
      'hoballoon:ViewContainer:subscribeToStore: `storesKey` argument should be an instance of Map ')
    this.storesKey = storesKey
    this._registerStores()

    this._views = new MapOfInstance(View)
    this._mounted = false
    this._rendered = false

    var eventHandler = Object.seal(new EventOrderedHandler())
    Object.defineProperty(this, '_EventHandler', {
      enumerable: false,
      configurable: false,
      value: eventHandler
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

  static eventTypes(key) {
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
    should(store instanceof StoreBase,
      'hoballoon:ViewContainer:subscribeToStore: `store` argument should be an instance of StoreBase ')

    store.subscribe(event,
      (payload, type) => {
        console.log('dispatch')

        this.dispatch(this._formatStoreEventName(storeKey, type), payload)
      },
      this, 100)
  }

  _registerStores() {
    // let stores = this.storeKey()
    // should(Array.isArray(stores),
    //   'hoballoon:ViewContainer:_registerStores: `subscribeToStores()` methode should return Array, %s given',
    //   typeof stores)

    // let countOfStores = stores.length
    // for (let i = 0; i < countOfStores; i++) {
    //   this.subscribeToStore(stores[i].storeKey, stores[i].event)
    // }
    // console.log('_registerStores')
    // console.log(this.storesKey)

    this.storesKey.forEach((value, key, map) => {
      // console.log(value)
      this.subscribeToStore(value, StoreBase.eventTypes('CHANGED'))
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
    // console.log('eventName')
    // console.log(eventName)

    let token = this.subscribe(
      eventName,
      (payload, type) => {
        // console.log('__ICI________________________________________________________________________')
        // console.log(this)
        // console.log(viewSuscribeToEvents)
        // console.log(view)
        view[eventCallbackPrefix + viewSuscribeToEvents](payload, type)

        // if (view.hasOwnProperty('on' + eventName) && view['on' + eventName]) {
        // console.log('__LA________________________________________________________________________')
        // }
      },
      view, 0)
    // console.log('this._tokenEvent.add(key, token)')
    // console.log(key)
    // console.log(token)

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
    should(isNode(parentNode),
      'hotballoon:ViewContainer:mount: `parentNode` arguement should be a NodeElement, %s given',
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
