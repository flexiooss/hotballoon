import {TypeCheck as TypeTypeCheck} from '@flexio-oss/js-commons-bundle/assert'
import {ArrayMap} from '@flexio-oss/js-commons-bundle/extended-flex-types'
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

    /**
     * @type {ArrayMap<string,[]>}
     * @private
     */
    let _tokenEvent = new ArrayMap()
    let _storesMap = new StoreBaseMap()
    let _views = new ViewContainerBaseMap()
    let parentNode

    Object.defineProperties(this, {
      _mounted: {
        configurable: false,
        enumerable: false,
        get: () =>  _mounted,
        set: (v) => {
          _mounted = TypeTypeCheck.assertIsBoolean(v)
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
        get: () => _rendered,
        set: (v) => {

          _rendered = TypeTypeCheck.assertIsBoolean(v)
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
        get: () => parentNode,
        set: (v) => {
          parentNode = TypeTypeCheck.assertIsNode(v)
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

    this._tokenEvent.forEach(
      /**
       *
       * @param {ListenedStore[]} listenedStores
       * @param storeId
       */
      (listenedStores, storeId) => {
      listenedStores.forEach(
        /**
         *
         * @param {ListenedStore} listenedStore
         */
        listenedStore => {
          listenedStore.remove()
      })
    })

    this.MapOfView().forEach(
      /**
       * @param {View} v
       */
      v => {
        v.remove()
      })

    this.MapOfView().clear()
    this._tokenEvent.clear()
    this._storesMap.clear()
    this._mounted = false
    this._rendered = false
  }

  /**
   * @param {View} view
   * @return {View}
   */
  addView(view) {
    this[_Views].set(view.ID(), view)
    return view
  }

  /**
   * @param {View} view
   * @return {this}
   */
  removeView(view) {
    if (this[_Views].has(view.ID())) {
      this[_Views].delete(view.ID())
    }
    return this
  }

  /**
   * @param {String} viewId
   * @return {View}
   */
  view(viewId) {
    return this[_Views].get(viewId)
  }

  /**
   * @return {ViewContainerBaseMap}
   */
  MapOfView() {
    return this[_Views]
  }

  /**
   * @return {boolean}
   */
  isRendered() {
    return this._rendered === true
  }

  /**
   * @return {boolean}
   */
  isMounted() {
    return this._mounted === true
  }
}
