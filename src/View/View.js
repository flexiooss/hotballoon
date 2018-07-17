'use strict'
import {CoreException} from '../CoreException'
import {CLASS_TAG_NAME} from '../CLASS_TAG_NAME'
import {assert, isBoolean, isFunction, isNode, isString} from 'flexio-jshelpers'
import {$} from '../HotballoonElement/HotBalloonAttributeHandler'
import {reconcile} from 'flexio-nodes-reconciliation'
import {html} from '../HotballoonElement/CreateHotBalloonElement'
import {ViewContainerBase} from './ViewContainerBase'
import {CHANGED as STORE_CHANGED} from '../Store/StoreInterface'

export class ViewParameters {
  /**
   * @constructor
   * @param {string} id
   * @param {ViewContainerBase} container
   */
  constructor(id, container) {
    assert(!!isString(id),
      'hotballoon:View:ViewParameters: `id` argument assert be a String'
    )
    assert(container instanceof ViewContainerBase,
      'hotballoon:View:ViewParameters: `container` argument should be an instance of `ViewContainerBase`'
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
export const CLASS_TAG_NAME_VIEW = Symbol('__HB__VIEW__')

/**
 * @class
 * @description View describe a fragment of DOM
 * @extends ViewContainerBase
 */
class View extends ViewContainerBase {
  /**
   * @constructor
   * @param {ViewParameters} viewParameters
   * @param {ViewStoresParameters} stores
   */
  constructor(viewParameters, stores) {
    super(viewParameters.id, stores)

    this.debug.color = 'blue'
    this.parentNode = viewParameters.container.parentNode

    var _node = null
    var _shouldInit = true
    var _shouldRender = true
    var _shouldMount = true
    const _nodeRefs = new Map()
    const _state = new Map()

    /**
     * @property {string} CLASS_TAG_NAME
     */
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
            'View:_node:set: `node` argument assert be a Node, `%s` given',
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
            'hotballoon:View:constructor: `_shouldInit` argument should be a boolean'
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
            'hotballoon:View:constructor: `_shouldRender` argument should be a boolean'
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
            'hotballoon:View:constructor: `_shouldMount` argument should be a boolean'
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
         * @name View#_state
         * @private
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
  static create(viewParameters, stores) {
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
   * Main method
   * @return {Node}
   */
  view() {
    throw new CoreException('view should be override', 'METHOD_NOT_OVERRIDE')
  }

  /**
   *
   * @param {String} querySelector
   * @param {HotballoonElementParams} [hotballoonElementParams]
   * @return {Node}
   */
  html(querySelector, hotballoonElementParams) {
    return html(this, querySelector, hotballoonElementParams)
  }

  /**
   *
   * @private
   * @description subscribe subView an event of this view
   * @param {String} keyStore
   * @param {StoreInterface} store
   * @param {updateCallback} clb : event name
   */
  _suscribeToStore(keyStore, store, clb = (oldState, newState) => true) {
    assert(isFunction(clb), 'hotballoon:View:_suscribeToStore: `clb` argument should be callable')
    this._tokenEvent.add(
      store._ID,
      store.subscribe(
        STORE_CHANGED,
        (payload, type) => {
          const oldState = this._state.get(keyStore)
          this._state.set(keyStore, payload.data)
          if (clb(oldState, payload.data)) {
            this.updateNode()
          }
        },
        this, 100)
    )
    /**
     *
     * @callback updateCallback
     * @param {Object} oldState
     * @param {Object} newState
     */
  }

  /**
   * @private
   * @description update the node reference of this View
   */
  _update() {
    reconcile(this.node, this.view(), this.parentNode)
  }

  /**
   * @public
   */
  updateNode() {
    this.debug.log('updateNode').background()
    this.debug.print()
    this._update()
  }

  /**
   * @private
   */
  _render() {
    this._replaceNode()
    this._setNodeViewRef()
  }

  /**
   * @return {Node} _node
   */
  render() {
    this.debug.log('render').size(2)
    this.debug.print()

    if (this._shouldRender) {
      this._render()
      this._rendered = true
    }

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
  _mount() {
    this.parentNode.appendChild(this.node)
  }

  /**
   * @public
   * @see _mount()
   * @param {Node} parentNode
   */
  mount() {
    if (this._shouldMount) {
      this._mount()
      this._mounted = true
    }

    this._shouldMount = true
  }

  shouldNotMount() {
    this._shouldMount = false
  }

  /**
   * @public
   * @description Render the View() into `_node` property and mount this into the `parentNode` argument
   * @param {Node} parentNode
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
    this._setNodeViewRef()
  }

  /**
   * @param {String} key
   * @return {Node} Node
   */
  nodeRef(key) {
    return this._nodeRefs.get(key)
  }

  /**
   * @alias nodeRef
   * @param {String} key
   * @return {Node} Node
   */
  $(key) {
    return this._nodeRefs.get(key)
  }

  /**
   * @param {String} key
   * @param {Node} node
   * @return {Node} Node
   * @memberOf NodesHandlerMixin
   * @instance
   */
  addNodeRef(key, node) {
    return this._setNodeRef(key, node)
  }

  /**
   * @param {String} key
   * @param {Node} node
   * @return {Node} Node
   */
  replaceNodeRef(key, node) {
    return this._setNodeRef(key, node)
  }

  /**
   * @private
   * @param {String} key
   * @param {Node} node
   * @return {Node} node
   */
  _setNodeRef(key, node) {
    $(node).setNodeRef(key)
    this._nodeRefs.set(key, node)
    node.setAttribute(ATTRIBUTE_NODEREF, key)
    return node
  }

  /**
   * @private
   */
  _setNodeViewRef() {
    $(this.node).setViewRef(this._ID)
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
  _replaceNode() {
    this._node = this.view()
    return this._node
  }

  /**
   * @return {ViewContainerBase}
   */
  Container() {
    return this._container
  }

  /**
   *
   * @return {HotBalloonApplication}
   */
  APP() {
    return this.Component().APP()
  }

  /**
   *
   * @return {Component}
   */
  Component() {
    return this.Container().Component()
  }
}

export {View}
