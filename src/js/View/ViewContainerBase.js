import {isBoolean, isNode, assert} from '@flexio-oss/assert'
import {ArrayMap} from '@flexio-oss/extended-flex-types'
import {WithID} from '../abstract/WithID'
import {EventOrderedHandler} from '../Event/EventOrderedHandler'
import {ViewContainerBaseMap} from './ViewContainerBaseMap'

const _EventHandler = Symbol('_EventHandler')
const _Views = Symbol('_Views')

/**
 * @extends WithID
 */
export class ViewContainerBase extends WithID {
  /**
   *
   * @param {String} id
   */
  constructor(id) {
    super(id)

    var _mounted = false
    var _rendered = false
    var _tokenEvent = new ArrayMap()
    var _views = new ViewContainerBaseMap()
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
            'hotballoon:ViewContainerBase:constructor: `__mounted` argument should be a boolean'
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
            'hotballoon:ViewContainerBase:constructor: `rendered` argument should be a boolean'
          )
          _rendered = v
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
         * @property {ArrayMap}
         * @name ViewContainerBase#_tokenEvent
         * @protected
         */
        value: _tokenEvent
      },
      [_Views]: {
        enumerable: false,
        configurable: false,
        /**
         * @property {ViewContainerBaseMap}
         * @name ViewContainerBase#_Views
         * @protected
         */
        value: _views
      },
      /**
       * @params {Node}
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
   * @protected
   * @param {EventListenerOrderedParam} eventListenerOrderedParam
   * @return {(String|StringArray)} token
   */
  _on(eventListenerOrderedParam) {
    return this[_EventHandler].on(eventListenerOrderedParam)
  }

  /**
   * @param {(String|Symbol)} eventType
   * @param {Object} payload
   */
  dispatch(eventType, payload) {
    this[_EventHandler].dispatch(eventType, payload)
  }

  /**
   *
   * @param {View} view
   * @param {?string} key
   * @return {View}
   */
  addView(view, key = null) {
    this[_Views].set(key || view.ID, view)
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

  /**
   *
   * @return {boolean}
   */
  isRendered() {
    return this._rendered === true
  }

  /**
   *
   * @return {boolean}
   */
  isMounted() {
    return this._mounted === true
  }
}
