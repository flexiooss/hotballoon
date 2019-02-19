'use strict'
import {MapOfArray, isBoolean, isNode, assert} from 'flexio-jshelpers'
import {WithIDBase} from '../bases/WithIDBase'
import {EventOrderedHandler} from '../Event/EventOrderedHandler'

const _EventHandler = Symbol('_EventHandler')
const _Views = Symbol('_Views')

/**
 * @extends WithIDBase
 */
export class ViewContainerBase extends WithIDBase {
  /**
   *
   * @param {String} id
   */
  constructor(id) {
    super(id)

    var _mounted = false
    var rendered = false
    var _tokenEvent = new MapOfArray()
    var _views = new Map()
    var parentNode

    Object.defineProperties(this, {
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
       * @name ViewContainerBase#rendered
       * @protected
       */
      rendered: {
        configurable: false,
        enumerable: false,
        get: () => {
          return rendered
        },
        set: (v) => {
          assert(!!isBoolean(v),
            'hotballoon:ViewContainerBase:constructor: `rendered` argument should be a boolean'
          )
          rendered = v
        }
      },
      [_EventHandler]: {
        enumerable: false,
        configurable: false,
        /**
         * @property {EventOrderedHandler}
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
      [_Views]: {
        enumerable: false,
        configurable: false,
        /**
         * @property {Map<view>}
         * @name ViewContainerBase#_Views
         * @protected
         */
        value: _views
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
            'hotballoon:view:constructor: `parentNode` argument should be a Node'
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
    return this[_EventHandler].on(eventListenerOrderedParam)
  }

  /**
   * @param {String} eventType
   * @param {Object} payload
   */
  dispatch(eventType, payload) {
    this[_EventHandler].dispatch(eventType, payload)
  }

  /**
   *
   * @param {View} view
   * @return {View}
   */
  addView(view) {
    this[_Views].set(view.ID, view)
    return view
  }

  /**
   *
   * @param {String|Symbol} key
   * @return {View}
   */
  view(key) {
    return this[_Views].get(key)
  }

  /**
   *
   * @return {Map<String, View>}
   */
  MapOfView() {
    return this[_Views]
  }


}
