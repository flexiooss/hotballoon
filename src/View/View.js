'use strict'
import {CoreException} from '../CoreException'
import {CLASS_TAG_NAME, CLASS_TAG_NAME_VIEW} from '../HasTagClassNameInterface'
import {assert, isBoolean, isFunction, isNode, isPrimitive, valueByKeys} from 'flexio-jshelpers'
import {$} from '../HotballoonNodeElement/HotBalloonAttributeHandler'
import {reconcile} from 'flexio-nodes-reconciliation'
import {html} from '../HotballoonNodeElement/CreateHotBalloonElement'
import {ViewContainerBase} from './ViewContainerBase'
import {STORE_CHANGED, StoreInterface} from '../Store/StoreInterface'
import {ViewStoresParameters} from './ViewStoresParameters'
import {EventListenerOrderedFactory} from '../Event/EventListenerOrderedFactory'

export class ViewParameters {
  /**
   * @constructor
   * @param {string|Symbol} id
   * @param {ViewContainerBase} container
   */
  constructor(id, container) {
    assert(!!isPrimitive(id),
      'hotballoon:view:ViewParameters: `id` argument assert be a String'
    )
    assert(container instanceof ViewContainerBase,
      'hotballoon:view:ViewParameters: `container` argument should be an instance of `ViewContainerBase`'
    )

    Object.defineProperties(this, {

      id: {
        configurable: false,
        enumerable: false,
        writable: false,
        /**
           * @type {String}
           * @name ViewParameters#id
           */
        value: id
      },
      container: {
        configurable: false,
        enumerable: false,
        writable: false,
        /**
           * @type {ViewContainerBase}
           * @name ViewParameters#container
           */
        value: container
      }
    }
    )
  }
}

export const ATTRIBUTE_NODEREF = '_hb_noderef'

const _mount = Symbol('_mount')
const _update = Symbol('_update')
const _render = Symbol('_render')
const _replaceNode = Symbol('_replaceNode')
const _setNodeRef = Symbol('_setNodeRef')
const _setNodeViewRef = Symbol('_setNodeViewRef')

/**
 * @class
 * @description view describe a fragment of DOM
 * @extends {ViewContainerBase}
 * @implements {HasTagClassNameInterface}
 */
class View extends ViewContainerBase {
  /**
   * @constructor
   * @param {ViewParameters} viewParameters
   */
  constructor(viewParameters) {
    super(viewParameters.id)
    assert(viewParameters instanceof ViewParameters, 'hotballoon:' + this.constructor.name + ':constructor: `viewParameters` should be an instance of ViewParameters')

    this.debug.color = 'blue'
    this.parentNode = viewParameters.container.parentNode

    var _node = null
    var _shouldInit = true
    var _shouldRender = true
    var _shouldMount = true
    const _nodeRefs = new Map()
    const _state = new Map()

    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_VIEW
    })

    Object.defineProperties(this, {
      _container: {
        enumerable: false,
        configurable: false,
        /**
         * @property {ViewContainerBase}
         * @name View#_container
         * @protected
         */
        value: viewParameters.container
      },
      _node: {
        enumerable: false,
        configurable: false,
        get: () => {
          /**
           * @property {Node} _node
           * @name View#_node
           * @private
           */
          return _node
        },
        set: (node) => {
          assert(isNode(node),
            'view:_node:set: `node` argument assert be a Node, `%s` given',
            typeof node
          )
          _node = node
        }
      },
      /**
       * @property {boolean} _shouldInit
       * @name View#_shouldInit
       * @private
       */
      _shouldInit: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _shouldInit
        },
        set: (v) => {
          assert(!!isBoolean(v),
            'hotballoon:view:constructor: `_shouldInit` argument should be a boolean'
          )
          _shouldInit = v
        }
      },
      /**
       * @property {boolean} _shouldRender
       * @name View#_shouldRender
       * @private
       */
      _shouldRender: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _shouldRender
        },
        set: (v) => {
          assert(!!isBoolean(v),
            'hotballoon:view:constructor: `_shouldRender` argument should be a boolean'
          )
          _shouldRender = v
        }
      },
      /**
       * @property {boolean} _shouldMount
       * @name View#_shouldMount
       * @private
       */
      _shouldMount: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _shouldMount
        },
        set: (v) => {
          assert(!!isBoolean(v),
            'hotballoon:view:constructor: `_shouldMount` argument should be a boolean'
          )
          _shouldMount = v
        }
      },
      /**
       * @property {Map} _nodeRefs
       * @name View#_nodeRefs
       * @private
       */
      _nodeRefs: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _nodeRefs
        },
        set: (v) => {
          return false
        }
      },
      _state: {
        configurable: false,
        enumerable: false,
        /**
         * @property {Map} _state
         * @type {Map<string, *>}
         * @name View#_state
         * @protected
         */
        value: _state
      }

    })
  }

  /**
   * @static
   * @param {ViewParameters} viewParameters
   * @param {ViewStoresParameters} stores
   * @return View
   */
  static create(viewParameters, stores = new ViewStoresParameters()) {
    return new this(viewParameters, stores)
  }

  /**
   *
   * @static
   * @param {ViewParameters} viewParameters
   * @param {ViewStoresParameters} stores
   * @param {Node} parentNode
   * @return View
   */
  static createWithParentNode(viewParameters, stores, parentNode) {
    const inst = new this(viewParameters, stores)
    inst.parentNode = parentNode
    return inst
  }

  /**
   * @return {Node}
   */
  template() {
    throw new CoreException('view should be override', 'METHOD_NOT_OVERRIDE')
  }

  /**
   *
   * @param {String} querySelector
   * @param {HotballoonElementParams} hotballoonElementParams
   * @return {Node}
   */
  html(querySelector, hotballoonElementParams) {
    return html(this, querySelector, hotballoonElementParams)
  }

  /**
   *
   * @description subscribe subView an event of this view
   * @param {StoreInterface} store
   * @param {View~updateCallback} clb
   */
  subscribeToStore(store, clb = (state) => true) {
    assert(isFunction(clb), 'hotballoon:' + this.constructor.name + ':subscribeToStore: `clb` argument should be callable')

    assert(store instanceof StoreInterface, 'hotballoon:' + this.constructor.name + ':subscribeToStore: `keyStore : %s` not reference an instance of StoreInterface', store)

    this._tokenEvent.add(
      store.ID,
      store.subscribe(
        EventListenerOrderedFactory
          .listen(STORE_CHANGED)
          .callback((payload, type) => {
            if (clb(payload.data) === true) {
              console.log(this.ID.toString() + ' this.updateNode()')
              this.updateNode()
            }
          })
          .build()
      )
    )
  }

  /**
   *
   * @callback View~updateCallback
   * @param {State} state
   * @return {boolean}
   */

  /**
   * @private
   * @description update the node reference of this View
   */
  [_update]() {
    reconcile(this.node, this.template(), this.parentNode)
  }

  /**
   * @public
   */
  updateNode() {
    this.debug.log('updateNode').background()
    this.debug.print()
    this[_update]()
  }

  /**
   * @private
   */
  [_render]() {
    this[_replaceNode]()
    this[_setNodeViewRef]()
  }

  /**
   * @return {Node} _node
   */
  render() {
    this.debug.log('render').size(2)
    this.debug.print()

    if (this._shouldRender) {
      this[_render]()
      this.rendered = true
    }
    console.log(this)

    this._shouldRender = true
    return this.node
  }

  /**
   * Set `_shouldRender` to false
   */
  shouldNotRender() {
    this._shouldRender = false
  }

  /**
   * @private
   * @description mount `_node` property into `parentNode` argument
   */
  [_mount]() {
    this.parentNode.appendChild(this.node)
  }

  /**
   * @public
   * @see _mount()
   */
  mount() {
    if (this._shouldMount) {
      this[_mount]()
      this._mounted = true
    }

    this._shouldMount = true
  }

  shouldNotMount() {
    this._shouldMount = false
  }

  /**
   * @description Render the template() into `_node` property and mount this into the `parentNode` argument
   */
  renderAndMount() {
    this.render()
    this.mount()
  }

  /**
   * @param {String} key
   * @param {View} view
   */
  addNodeView(key, view) {
    this[_setNodeViewRef]()
  }

  /**
   * @param {String} key
   * @return {Node}
   */
  nodeRef(key) {
    return this._nodeRefs.get(key)
  }

  /**
   * @alias nodeRef
   * @param {String} key
   * @return {HotBalloonAttributeHandler}
   */
  $(key) {
    return $(this._nodeRefs.get(key))
  }

  /**
   * @param {String} key
   * @param {Node} node
   * @return {Node}
   * @instance
   */
  addNodeRef(key, node) {
    return this[_setNodeRef](key, node)
  }

  /**
   * @param {String} key
   * @param {Node} node
   * @return {Node}
   */
  replaceNodeRef(key, node) {
    return this[_setNodeRef](key, node)
  }

  /**
   * @private
   * @param {String} key
   * @param {Node} node
   * @return {Node} node
   */
  [_setNodeRef](key, node) {
    $(node).setNodeRef(key)
    this._nodeRefs.set(key, node)
    node.setAttribute(ATTRIBUTE_NODEREF, key)
    return node
  }

  /**
   * @private
   */
  [_setNodeViewRef]() {
    $(this.node).setViewRef(this.ID)
  }

  /**
   * @return {Node} node
   */
  get node() {
    return this._node
  }

  /**
   * @return {Node} node
   */
  [_replaceNode]() {
    this._node = this.template()
    return this._node
  }

  /**
   * @return {ViewContainerBase}
   */
  container() {
    return this._container
  }

  /**
   *
   * @return {HotBalloonApplication}
   */
  APP() {
    return this.componentContext().APP()
  }

  /**
   *
   * @return {componentContext}
   */
  componentContext() {
    return this.container().componentContext()
  }

  /**
   *
   * @param key
   * @param defaultValue
   */
  stateValue(key, defaultValue = null) {
    return (this._state.has(key)) ? this._state.get(key) : defaultValue
  }

  /**
   *
   * @param {array<string>} keys
   * @param defaultValue
   */
  stateValueByKeys(keys, defaultValue = null) {
    const keyStore = keys.shift()
    if (this._state.has(keyStore)) {
      return (keys.length) ? valueByKeys(this._state.get(keyStore), keys, defaultValue) : this._state.get(keyStore)
    }
    return defaultValue
  }
}

export {View}
