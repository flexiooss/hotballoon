'use strict'
import { CLASS_TAG_NAME } from './CLASS_TAG_NAME'
import { MapOfArray, MapOfInstance, assert, isBoolean, isNode } from 'flexio-jshelpers'
import { select as $ } from './HotballoonElement/HotBalloonAttributeHandler'

import { reconcile } from 'flexio-nodes-reconciliation'
import { EventOrderedHandler } from './EventOrderedHandler'
import { NodesHandlerMixin } from './mixins/NodesHandlerMixin'
import { PrivateStateMixin } from './mixins/PrivateStateMixin'
import { RequireIDMixin } from './mixins/RequireIDMixin'
import { ViewContainerContextMixin } from './mixins/ViewContainerContextMixin'

export const INIT = 'INIT'
export const UPDATE = 'UPDATE'
export const UPDATED = 'UPDATED'
export const RENDER = 'RENDER'
export const RENDERED = 'RENDERED'
export const MOUNT = 'MOUNT'
export const MOUNTED = 'MOUNTED'
export const STATE_CHANGE = 'STATE_CHANGE'
export const STATE_CHANGED = 'STATE_CHANGED'
export const STORE_CHANGED = 'STORE_CHANGED'

export const ATTRIBUTE_NODEREF = '_hb_noderef'

/**
 * @class
 * @description View describe a fragment of DOM
 * @extends ViewContainerContextMixin
 * @extends NodesHandlerMixin
 * @extends ViewContainerContextMixin
 * @extends PrivateStateMixin
 * @extends RequireIDMixin
 *
 */
class View extends NodesHandlerMixin(ViewContainerContextMixin(PrivateStateMixin(RequireIDMixin(class { })))) {
  /**
   * @constructor
   * @param {String} id
   * @param {ViewContainer} viewContainer
   */
  constructor(id, viewContainer) {
    super()
    this.RequireIDMixinInit(id)
    this.ViewContainerContextMixinInit(viewContainer)
    this.PrivateStateMixinInit()
    this.NodesHandlerMixinInit(View)

    var _node = null
    var parentNode = viewContainer.parentNode
    var _shouldInit = true
    var _shouldUpdate = true
    var _shouldRender = true
    var _shouldChangeState = true
    var _isRendered = false
    const _EventHandler = new EventOrderedHandler()
    const _tokenEvent = new MapOfArray()
    const _nodeRefs = new Map()
    const _subViews = new MapOfInstance(View)

    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: '__HB__VIEW__'
    })

    Object.defineProperties(this, {
      _node: {
        enumerable: false,
        configurable: false,
        get: () => {
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
      parentNode: {
        configurable: false,
        enumerable: true,
        get: () => {
          return parentNode
        },
        set: (v) => {
          assert(!!isNode(v),
            'hotballoon:View:constructor: `parentNode` argument should be a NodeElement'
          )
          parentNode = v
        }
      },
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
      _shouldUpdate: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _shouldUpdate
        },
        set: (v) => {
          assert(!!isBoolean(v),
            'hotballoon:View:constructor: `_shouldUpdate` argument should be a boolean'
          )
          _shouldUpdate = v
        }
      },
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
      _shouldChangeState: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _shouldChangeState
        },
        set: (v) => {
          assert(!!isBoolean(v),
            'hotballoon:View:constructor: `_shouldChangeState` argument should be a boolean'
          )
          _shouldChangeState = v
        }
      },
      _isRendered: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _isRendered
        },
        set: (v) => {
          assert(!!isBoolean(v),
            'hotballoon:View:constructor: `_isRendered` argument should be a boolean'
          )
          _isRendered = v
        }
      },
      _EventHandler: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _EventHandler
        },
        set: (v) => {
          return false
        }
      },
      _tokenEvent: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _tokenEvent
        },
        set: (v) => {
          return false
        }
      },
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
      _subViews: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _subViews
        },
        set: (v) => {
          return false
        }
      }
    })

    this._initListeners()
  }

  /**
   * @static
   * @param {string} id
   * @param {hotballoon:ViewContainer} viewContainer
   * @return View
   */
  static create(id, viewContainer) {
    return new this(id, viewContainer)
  }

  /**
   *
   * @static
   * @param {string} id
   * @param {hotballoon:ViewContainer} viewContainer
   * @param {nodeElement} parentNode
   * @return View
   */
  static createWithParentNode(id, viewContainer, parentNode) {
    const inst = new this(id, viewContainer)
    inst.parentNode = parentNode
    return inst
  }

  /**
   * Main method
   * @return {NodeType}
   */
  view() { }

  /**
 *
 * @private
 * @description suscribe subView an event of this view
 * @param {String} key
 * @param {hotballoon/View} subView
 * @param {String} event : event name
 */
  _suscribeToEvent(key, subView, event = STORE_CHANGED) {
    let token = this.addEventListener(
      event,
      (payload, type) => {
        subView.dispatch(event, payload)
      },
      subView, 100)

    this._tokenEvent.add(key, token)
  }

  /**
   * @private
   * @description register all events for private listeners
   * Internal event property with callable value
   */
  _initListeners() {
    this.addEventListener(
      STORE_CHANGED,
      (payload, type) => {
        this.updateNode(payload)
      },
      this,
      100
    )
  }

  addEventListener(event, callback, scope, priority) {
    this._EventHandler.addEventListener(event, callback, scope, priority)
  }
  /**
   *
   * @param {String} event : event name
   * @param {Object} payload
   * @returns void
   */
  dispatch(event, payload) {
    this._EventHandler.dispatch(event, payload)
  }

  /**
 * @private
 * @param {String} key
 * @param {any} val
 */
  _setPrivateStateProp(key, val) {
    this.dispatch(STATE_CHANGE, {
      key,
      val
    })
    if (this._shouldChangeState) {
      let oldStateProp = this._privateState.get(key)
      this._privateState.set(key, val)
      this.dispatch(STATE_CHANGED, {
        key,
        val: oldStateProp
      })
      this.updateNode()
    }
    this._shouldChangeState = true
  }

  /**
   *
   * @param {string} key
   * @param {any} defaultValue
   * @returns any
   */
  _getPrivateStateProp(key, defaultValue = undefined) {
    return (this._privateState.has(key)) ? this._privateState.get(key) : defaultValue
  }

  /**
   * @private
   * @description update the node reference of this View
   */
  _update() {
    reconcile(this.node(), this.view(), this.parentNode)
  }

  /**
   * @public
   */
  updateNode() {
    console.log('%c updateNode ' + this.constructor.name, 'background: #222; color: #bada55')

    this._EventHandler.dispatch(UPDATE, {})

    if (this._shouldUpdate) {
      this._update()
      this._EventHandler.dispatch(UPDATED, {})
    }

    this._shouldUpdate = true
  }

  /**
   * @private
   */
  _render() {
    this._replaceNode()
    this._setNodeViewRef()
  }

  /**
   * @public
   */
  render() {
    this._EventHandler.dispatch(RENDER, {})

    if (this._shouldRender) {
      this._render()
      this._isRendered = true
      this._EventHandler.dispatch(RENDERED, {})
    }

    this._shouldRender = true
    return this.node()
  }

  /**
   * @private
   * @description mount `_node` property into `parentNode` argument
   */
  _mount() {
    this.parentNode.appendChild(this.node())
  }

  /**
   * @public
   * @see _mount()
   * @param {NodeElement} parentNode
   */
  mount() {
    this._EventHandler.dispatch(MOUNT, {})

    if (this._shouldRender) {
      this._mount()
      this._isRendered = true
      this._EventHandler.dispatch(MOUNTED, {})
    }

    this._shouldRender = true
  }

  /**
   * @public
   * @description Render the View() into `_node` property and mount this into the `parentNode` argument
   * @param {NodeElement} parentNode
   */
  renderAndMount() {
    this.render()
    this.mount()
  }

  /**
  * @param {String} key
  * @return {View} view
  * @memberOf NodesHandlerMixin
  * @instance
  */
  subView(key) {
    return this._subViews.get(key)
  }

  /**
   * @param {String} key
   * @param {View} view
   * @memberOf NodesHandlerMixin
   * @instance
   */
  registerSubView(key, view, stores = new Set()) {
    // view.ViewContainer().addView(view, stores)
    view.ViewContainer().suscribeToStoreEvent(view, stores)
    this._addSubView(key, view)
    this.addEventListener(
      STATE_CHANGED,
      (state) => {
        this._setPrivateStateProp(state.key, state.val)
      },
      this,
      100
    )
    return view
  }

  /**
   * @param {String} key
   * @param {View} view
   * @memberOf NodesHandlerMixin
   * @instance
   */
  addNodeSubView(key, view) {
    this._setNodeViewRef()
    // this._addSubView(key, view)
  }

  /**
   * @param {String} key
   * @return {NodeElement} nodeElement
   * @memberOf NodesHandlerMixin
   * @instance
   */
  nodeRef(key) {
    return this._nodeRefs.get(key)
  }

  /**
   * @param {String} key
   * @param {NodeElement} node
   * @return {NodeElement} nodeElement
   * @memberOf NodesHandlerMixin
   * @instance
   */
  addNodeRef(key, node) {
    return this._setNodeRef(key, node)
  }

  /**
   * @private
   * @param {String} key
   * @param {View} view
   * @return {View} view
   * @memberOf NodesHandlerMixin
   * @instance
   */
  _addSubView(key, view) {
    assert(key,
      'hoballoon:View:_addSubView: `key` argument assert not be undefined')
    this._subViews.set(key, view)
    return view
  }

  /**
   * @param {String} key
   * @param {NodeElement} node
   * @return {NodeElement} nodeElement
   * @memberOf NodesHandlerMixin
   * @instance
   */
  replaceNodeRef(key, node) {
    return this._setNodeRef(key, node)
  }

  /**
  * @private
  * @param {String} key
  * @param {NodeElement} node
  * @return {NodeElement} node
  * @memberOf NodesHandlerMixin
  * @instance
  */
  _setNodeRef(key, node) {
    $(node).setNodeRef(key)
    this._nodeRefs.set(key, node)
    node.setAttribute(ATTRIBUTE_NODEREF, key)
    return node
  }

  /**
   * @private
   * @memberOf NodesHandlerMixin
   * @instance
   */
  _setNodeViewRef() {
    $(this.node()).setViewRef(this._ID)
  }

  /**
   * @returns {NodeElement} node
   * @memberOf NodesHandlerMixin
   * @instance
   */
  node() {
    return this._node
  }

  /**
   * @returns {NodeElement} node
   * @memberOf NodesHandlerMixin
   * @instance
   */
  _replaceNode() {
    this._node = this.view()
    return this._node
  }
}

export {
  View
}
