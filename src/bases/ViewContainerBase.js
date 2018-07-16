'use strict'
import {EventOrderedHandler} from '../EventOrderedHandler'
import {View} from '../View'
import {LogHandler, MapOfArray, MapOfInstance, isBoolean, isNode, assert} from 'flexio-jshelpers'
import {WithIDBase} from './WithIDBase'

class ViewContainerBase extends WithIDBase {
  /**
   *
   * @param {String} id
   */
  constructor(id) {
    super(id)

    var _mounted = false
    var _rendered = false
    var _tokenEvent = new MapOfArray()
    var _Views = new MapOfInstance(View)
    var _Stores = new Map()
    var parentNode

    Object.defineProperties(this, {
      /**
       * @property {Map}
       * @name ViewContainerBase#_Stores
       * @protected
       */
      _Stores: {
        configurable: false,
        enumerable: true,
        writable: false,
        value: _Stores
      },
      /**
       * @property {boolean}
       * @name ViewContainerBase#_mounted
       * @protected
       */
      _mounted: {
        configurable: false,
        enumerable: false,
        get: () => {
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
      /**
       * @property {EventOrderedHandler}
       * @name ViewContainerBase#_EventHandler
       * @protected
       */
      _EventHandler: {
        enumerable: false,
        configurable: false,
        value: Object.seal(new EventOrderedHandler())
      },
      /**
       * @property {MapOfArray}
       * @name ViewContainerBase#_tokenEvent
       * @protected
       */
      _tokenEvent: {
        enumerable: false,
        configurable: false,
        value: _tokenEvent
      },
      /**
       * @property {MapOfInstance<View>
       * @name ViewContainerBase#_Views
       * @protected
       */
      _Views: {
        enumerable: false,
        configurable: false,
        value: _Views
      },
      /**
       * @property {Node}
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
      },
      /**
       * @property {LogHandler}
       * @name ViewContainerBase#debug
       */
      debug: {
        configurable: false,
        enumerable: false,
        value: new LogHandler(this.constructor.name)
      }
    })
  }

  /**
   * @param {String} event
   * @param {Function} callback
   * @param {Object} scope
   * @param {Number} priority
   * @return {String} token
   */
  addEventListener(type, callback, scope, priority) {
    return this._EventHandler.addEventListener(type, callback, scope, priority)
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
    this._Views.add(view._ID, view)
    return view
  }

  /**
   *
   * @param {String} key : View._ID
   * @return {View}
   */
  View(key) {
    return this._Views.get(key)
  }
}

export {ViewContainerBase}
