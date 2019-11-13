import {isBoolean, isNode, assert} from '@flexio-oss/assert'
import {ArrayMap} from '@flexio-oss/extended-flex-types'
import {WithID} from '../abstract/WithID'
import {OrderedEventHandler} from '../Event/OrderedEventHandler'
import {ViewContainerBaseMap} from './ViewContainerBaseMap'
import {StoreBaseMap} from '../Store/StoreBaseMap'

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

    let _mounted = false
    let _rendered = false
    let _tokenEvent = new ArrayMap()
    let _storesMap = new StoreBaseMap()
    let _views = new ViewContainerBaseMap()
    let parentNode

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
         * @property {OrderedEventHandler}
         * @name ViewContainerBase#_EventHandler
         * @protected
         */
        value: Object.seal(new OrderedEventHandler())
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
      _storesMap: {
        enumerable: false,
        configurable: false,
        /**
         * @property {StoreBaseMap}
         * @name ViewContainerBase#_storesMap
         * @protected
         */
        value: _storesMap
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
       * @params {Element}
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
            'hotballoon:view:constructor: `parentNode` argument should be a Element'
          )
          parentNode = v
        }
      }
    })
  }

  /**
   * @protected
   * @param {OrderedEventListenerConfig} orderedEventListenerConfig
   * @return {(String|StringArray)} token
   */
  _on(orderedEventListenerConfig) {
    return this[_EventHandler].on(orderedEventListenerConfig)
  }

  /**
   * @param {(String|Symbol)} eventType
   * @param {Object} payload
   */
  dispatch(eventType, payload) {
    this[_EventHandler].dispatch(eventType, payload)
  }

  remove() {
    this[_EventHandler].clear()

    this._tokenEvent.forEach((tokens, storeId) => {
      tokens.forEach(token => {
        this._storesMap.get(storeId).stopListenChanged(token)
      })
    })

    this.MapOfView().forEach(v => {
      v.remove()
    })
    
    this.MapOfView().clear()
    this._tokenEvent.clear()
    this._storesMap.clear()
    this[_Views].clear()
    this._mounted = false
    this._rendered = false
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
