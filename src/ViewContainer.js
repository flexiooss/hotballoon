import {
  View
} from './View'
import {
  InstancesMap
} from './InstancesMap'
import {
  ApplicationContext
} from './ApplicationContext'
import {
  EventOrderedHandler
} from './EventOrderedHandler'
import {
  StoreBase
} from './StoreBase'
import {
  shouldIs
} from './shouldIs'
import {
  isNode
} from './helpers'
import {
  ArrayMap
} from './ArrayMap'

const eventCallbackPrefix = 'on'
const viewSuscribeToEvents = 'StoreChanged'

/**
 * @class
 * ViewContainer is a Views container who can suscribe to Stores to dispatch state to Views
 */
class ViewContainer extends ApplicationContext {
  constructor(hotBallonApplication) {
    super(hotBallonApplication)

    this._views = new InstancesMap(View)
    this._mounted = false
    this._rendered = false

    var eventHandler = Object.seal(new EventOrderedHandler())
    Object.defineProperty(this, '_EventHandler', {
      enumerable: false,
      configurable: false,
      value: eventHandler
    })
    this._tokenEvent = new ArrayMap()
  }

  init() {
    this._registerStores()
    this.mount()
  }

  /**
     *
     * --------------------------------------------------------------
     * EventHandler
     * --------------------------------------------------------------
     */

  static eventTypes() {
    return {
      INIT: 'INIT',
      STORE_CHANGE: 'STORE_CHANGE'
    }
  }

  _formatStoreEventName(storeKey, type) {
    return storeKey + '_' + type
  }

  subscribe(type, callback, scope, priority) {
    return this._EventHandler.addEventListener(type, callback, scope, priority)
  }

  dispatch(eventType, payload) {
    console.log('dispatch')
    this._EventHandler.dispatch(eventType, payload)
  }

  /**
     *
     * --------------------------------------------------------------
     * Stores
     * --------------------------------------------------------------
     */

  subscribeToStore(storeKey, event) {
    let store = this.APP().getStore(storeKey)

    shouldIs(store instanceof StoreBase,
      'hoballoon:ViewContainer:subscribeToStore: `store` argument should be an instance of StoreBase ')

    store.subscribe(event,
      (payload, type) => {
        this.dispatch(this._formatStoreEventName(storeKey, type), payload)
      },
      this, 100)
  }

  subscribeToStores() {
    return []
  }

  _registerStores() {
    let stores = this.subscribeToStores()
    shouldIs(Array.isArray(stores),
      'hoballoon:ViewContainer:_registerStores: `subscribeToStores()` methode should return Array, %s given',
      typeof stores)

    let countOfStores = stores.length
    for (let i = 0; i < countOfStores; i++) {
      this.subscribeToStore(stores[i].storeKey, stores[i].event)
    }
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
  addView(key, view, storeKey, storeEvent) {
    shouldIs(key,
      'hoballoon:ViewContainer:addView: `key` argument should not be undefined')
    this._views.add(view, key)
    if (storeKey && storeEvent) {
      this._suscribeToEvent(key, storeKey, storeEvent, view)
    }
    return view
  }

  _suscribeToEvent(key, storeKey, storeEvent, view) {
    var eventName = this._formatStoreEventName(storeKey, storeEvent)

    let token = this.subscribe(
      eventName,
      (payload, type) => {
        console.log('__ICI________________________________________________________________________')
        console.log(this)
        console.log(viewSuscribeToEvents)
        console.log(view)
        view[eventCallbackPrefix + viewSuscribeToEvents](payload, type)

        // if (view.hasOwnProperty('on' + eventName) && view['on' + eventName]) {
        // console.log('__LA________________________________________________________________________')
        // }
      },
      view, 0)

    this._tokenEvent.add(key, token)
  }

  replaceView(view, key) {
    this._views.replace(view, key)
  }

  getView(key) {
    return this._views.get(key)
  }

  registerViews() {}
  /**
     *
     * --------------------------------------------------------------
     * Rendering
     * --------------------------------------------------------------
     */
  mount() {
    this.registerViews()
    this._mounted = true
  }

  _renderViews(parentNode) {
    this._views.foreach((key, view) => {
      view.render(parentNode)
    })
  }

  render(parentNode) {
    shouldIs(isNode(parentNode),
      'hotballoon:ViewContainer:render: `parentNode` arguement should be a NodeElement, %s given',
      typeof parentNode)
    if (!this._mounted) {
      this.mount()
    }
    this._renderViews(parentNode)
    this._rendered = true
  }

  /**
     *
     * --------------------------------------------------------------
     * Actions
     * --------------------------------------------------------------
     */
  createAction(actionName, typAction, payload) {
    const action = this.APP().getAction(actionName)
    if (action) {
      action.newAction(typAction, payload)
    }
  }

  newViewAction(actionName, clb, ...args) {
    this.createAction(actionName, clb, ...args)
  }
}

export {
  ViewContainer
}
