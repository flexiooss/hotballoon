'use strict'
import {MapOfArray, isBoolean, isNode, assert} from 'flexio-jshelpers'
import {WithIDBase} from '../bases/WithIDBase'
import {ViewStoresParameters} from './ViewStoresParameters'
import {CHANGED, StoreInterface} from '../Store/StoreInterface'
import {EventOrderedHandler} from '../Event/EventOrderedHandler'

class ViewContainerBase extends WithIDBase {
  /**
   *
   * @param {String} id
   * @param {ViewStoresParameters} stores
   */
  constructor(id, stores = new ViewStoresParameters()) {
    super(id)

    var _mounted = false
    var _rendered = false
    var _tokenEvent = new MapOfArray()
    var _Views = new Map()
    var parentNode

    Object.defineProperties(this, {
      _Stores: {
        configurable: false,
        enumerable: true,
        writable: false,
        /**
         * @property {Map<StoreInterface>}
         * @name ViewContainerBase#_Stores
         * @protected
         */
        value: stores._Stores
      },
      _mounted: {
        configurable: false,
        enumerable: false,
        get: () => {
          /**
           * @property {boolean}
           * @name ViewContainerBase#_mounted
           * @protected
           */
          return _mounted
        },
        set: (v) => {
          assert(!!isBoolean(v),
            'hotballoon:ViewContainerBase:constructor: `_mounted` argument should be a boolean'
          )
          _mounted = v
        }
      },
      /**
       * @property {boolean}
       * @name ViewContainerBase#_rendered
       * @protected
       */
      _rendered: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _rendered
        },
        set: (v) => {
          assert(!!isBoolean(v),
            'hotballoon:ViewContainerBase:constructor: `_rendered` argument should be a boolean'
          )
          _rendered = v
        }
      },
      _EventHandler: {
        enumerable: false,
        configurable: false,
        /**
         * @property {EventOrderedHandlerOld}
         * @name ViewContainerBase#_EventHandler
         * @protected
         */
        value: Object.seal(new EventOrderedHandler())
      },
      _tokenEvent: {
        enumerable: false,
        configurable: false,
        /**
         * @property {MapOfArray}
         * @name ViewContainerBase#_tokenEvent
         * @protected
         */
        value: _tokenEvent
      },
      _Views: {
        enumerable: false,
        configurable: false,
        /**
         * @property {Map<View>
         * @name ViewContainerBase#_Views
         * @protected
         */
        value: _Views
      },
      /**
       * @type {Node}
       * @name ViewContainerBase#parentNode
       * @protected
       */
      parentNode: {
        configurable: false,
        enumerable: true,
        get: () => {
          return parentNode
        },
        set: (v) => {
          assert(!!isNode(v),
            'hotballoon:View:constructor: `parentNode` argument should be a Node'
          )
          parentNode = v
        }
      }
    })
  }

  /**
   * @param {EventListenerOrderedParam} eventListenerOrderedParam
   * @return {String} token
   */
  on(eventListenerOrderedParam) {
    return this._EventHandler.on(eventListenerOrderedParam)
  }

  /**
   * @param {String} eventType
   * @param {Object} payload
   */
  dispatch(eventType, payload) {
    this._EventHandler.dispatch(eventType, payload)
  }

  /**
   *
   * @param {View} view
   * @return {View}
   */
  addView(view) {
    this._Views.set(view._ID, view)
    return view
  }

  /**
   *
   * @param {String} key
   * @return {View}
   */
  View(key) {
    return this._Views.get(key)
  }

  /**
   * @description Format an Event name
   * @param {StoreInterface} store
   * @return {string} event name formated
   * @static
   */
  static uniqueNameStoreChanged(store) {
    assert(store instanceof StoreInterface, 'hotballoon:ViewContainerBase:uniqueNameStoreChanged: `store` argument should be an instance of StoreInterface')
    return store._ID + '_' + CHANGED
  }

  /**
   *
   * @param key
   * @return {StoreInterface}
   * @protected
   */
  _Store(key) {
    return this._Stores.get(key)
  }
}

export {ViewContainerBase}
