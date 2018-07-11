'use strict'
import {CoreException} from './CoreException'
import {CLASS_TAG_NAME} from './CLASS_TAG_NAME'
import {MapOfArray, MapOfInstance, assert, isBoolean, isNode} from 'flexio-jshelpers'
import {$} from './HotballoonElement/HotBalloonAttributeHandler'
import {reconcile} from 'flexio-nodes-reconciliation'
import {EventOrderedHandler} from './EventOrderedHandler'
import {RequireIDMixin} from './mixins/RequireIDMixin'
import {PrivateStateMixin} from './mixins/PrivateStateMixin'
import {DebugableMixin} from './mixins/DebugableMixin'
import {ViewContainerContextMixin} from './mixins/ViewContainerContextMixin'

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
 * @extends DebugableMixin
 * @extends ViewContainerContextMixin
 * @extends ViewContainerContextMixin
 * @extends PrivateStateMixin
 * @extends RequireIDMixin
 *
 */
class View extends DebugableMixin(ViewContainerContextMixin(PrivateStateMixin(RequireIDMixin(class {
})))) {
  /**
   * @constructor
   * @param {string} id
   * @param {ViewContainer} viewContainer
   */
  constructor(id, viewContainer) {
    super()

    this.DebugableMixinInit()
    this.RequireIDMixinInit(id)
    this.ViewContainerContextMixinInit(viewContainer)
    this.PrivateStateMixinInit()

    var _node = null
    var parentNode = viewContainer.parentNode
    var _shouldInit = true
    var _shouldUpdate = true
    var _shouldRender = true
    var _shouldMount = true
    var _shouldChangeState = true
    var _isRendered = false
    var _isMounted = false
    const _EventHandler = new EventOrderedHandler()
    const _tokenEvent = new MapOfArray()
    const _nodeRefs = new Map()
    const _subViews = new MapOfInstance(View)

    /**
     * @property {string} CLASS_TAG_NAME
     */
    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: '__HB__VIEW__'
    })

    Object.defineProperties(this, {
      /**
       * @property {Node} _node
       * @private
       */
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
      /**
       * @property {Node} parentNode
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
       * @property {boolean} _shouldInit
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
       * @property {boolean} _shouldUpdate
       * @private
       */
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
      /**
       * @property {boolean} _shouldRender
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
       * @property {boolean} _shouldChangeState
       * @private
       */
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
      /**
       * @property {boolean} _isRendered
       * @private
       */
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
      /**
       * @property {boolean} _isMounted
       * @private
       */
      _isMounted: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _isMounted
        },
        set: (v) => {
          assert(!!isBoolean(v),
            'hotballoon:View:constructor: `_isMounted` argument should be a boolean'
          )
          _isMounted = v
        }
      },
      /**
       * @property {EventOrderedHandler} _EventHandler
       * @private
       */
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
      /**
       * @property {MapOfArray} _tokenEvent
       * @private
       */
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
      /**
       * @property {Map} _nodeRefs
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
      /**
       * @property {MapOfInstance<View>} _subViews
       * @private
       */
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
   * @param {Node} parentNode
   * @return View
   */
  static createWithParentNode(id, viewContainer, parentNode) {
    const inst = new this(id, viewContainer)
    inst.parentNode = parentNode
    return inst
  }

  /**
   * Main method
   * @return {Node}
   */
  view() {
    throw new CoreException('view should be overiderd', 'METHOD_NOT_OVERIDED')
  }

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

  /**
   *
   * @param {string} event
   * @param {function} callback
   * @param {Object} scope
   * @param {number} priority
   * @return {string} token
   */
  addEventListener(event, callback, scope, priority) {
    return this._EventHandler.addEventListener(event, callback, scope, priority)
  }

  /**
   *
   * @param {string} event : event name
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
    this._log('%c updateNode ' + this.constructor.name, 'background: #222; color: #bada55')

    this._EventHandler.dispatch(UPDATE, {})

    if (this._shouldUpdate) {
      this._update()
      this._EventHandler.dispatch(UPDATED, {})
    }

    this._shouldUpdate = true
  }

  /**
   *
   */
  shouldNotUpdate() {
    this._shouldUpdate = false
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
    this._log('%c View:render: ' + this.constructor.name, 'background: #222; color: white; width:100%;font-size:15px;')

    this._EventHandler.dispatch(RENDER, {})

    if (this._shouldRender) {
      this._render()
      this._isRendered = true
      this._EventHandler.dispatch(RENDERED, {})
    }

    this._shouldRender = true
    return this.node()
  }

  shouldNotRender() {
    this._shouldRender = false
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
   * @param {Node} parentNode
   */
  mount() {
    this._EventHandler.dispatch(MOUNT, {})

    if (this._shouldMount) {
      this._mount()
      this._isMounted = true
      this._EventHandler.dispatch(MOUNTED, {})
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
   * @param {iterable<Store>} stores
   * @instance
   */
  registerSubView(key, view, stores = new Set()) {
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
   * @return {Node} Node
   * @memberOf NodesHandlerMixin
   * @instance
   */
  nodeRef(key) {
    return this._nodeRefs.get(key)
  }

  /**
   * nodeRef alias
   * @param {String} key
   * @return {Node} Node
   * @memberOf NodesHandlerMixin
   * @instance
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
   * @param {Node} node
   * @return {Node} Node
   * @memberOf NodesHandlerMixin
   * @instance
   */
  replaceNodeRef(key, node) {
    return this._setNodeRef(key, node)
  }

  /**
   * @private
   * @param {String} key
   * @param {Node} node
   * @return {Node} node
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
   * @returns {Node} node
   * @memberOf NodesHandlerMixin
   * @instance
   */
  node() {
    return this._node
  }

  /**
   * @returns {Node} node
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
