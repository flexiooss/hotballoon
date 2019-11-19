import {CoreException} from '../CoreException'
import {Checksum} from '@flexio-oss/js-helpers'
import {CLASS_TAG_NAME, CLASS_TAG_NAME_VIEW} from '../Types/HasTagClassNameInterface'
import {assertType, isBoolean, isFunction, isNode, isNull} from '@flexio-oss/assert'
import {symbolToString} from '@flexio-oss/js-type-helpers'
import {UID} from '@flexio-oss/js-helpers'
import {$} from '../HotballoonNodeElement/HotBalloonAttributeHandler'
import {startReconcile} from '../HotballoonNodeElement/HotballoonElementReconciliation'
import {html} from '../HotballoonNodeElement/CreateHotBalloonElement'
import {ViewContainerBase} from './ViewContainerBase'
import {TypeCheck} from '../Types/TypeCheck'
import {
  ViewPublicEventHandler,
  VIEW_RENDER,
  VIEW_RENDERED,
  VIEW_UPDATE,
  VIEW_UPDATED,
  VIEW_STORE_CHANGED,
  VIEW_MOUNT,
  VIEW_MOUNTED
} from './ViewPublicEventHandler'

export const ATTRIBUTE_NODEREF = '_hb_noderef'

const _mount = Symbol('_mount')
const _update = Symbol('_update')
const _render = Symbol('_render')
const _replaceNode = Symbol('_replaceNode')
const _addNodeRef = Symbol('_addNodeRef')
const _setNodeViewRef = Symbol('_setNodeViewRef')

const viewLogOptions = {
  color: 'blue',
  titleSize: 2
}

const requestAFrame = window.requestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.mozRequestAnimationFrame
  || window.msRequestAnimationFrame
  || function(cb) {
    return setTimeout(cb, 16)
  }

/**
 * @extends {ViewContainerBase}
 * @implements {HasTagClassNameInterface}
 */
export class View extends ViewContainerBase {
  /**
   * @param {ViewContainerBase} container
   */
  constructor(container) {
    super(UID('View_' + container.constructor.name + '_'))

    assertType(
      TypeCheck.isViewContainerBase(container),
      'hotballoon:' + this.constructor.name + ':constructor: `container` should be an instance of ViewContainerBase'
    )

    this.parentNode = container.parentNode

    let _node = null
    let _shouldInit = true
    let _shouldRender = true
    let _shouldMount = true
    let _shouldUpdate = true
    const _nodeRefs = new Map()

    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_VIEW
    })
    this.weakNodeRefs = new WeakSet()

    Object.defineProperties(this, {
      _container: {
        enumerable: false,
        configurable: false,
        /**
         * @property {ViewContainerBase}
         * @name View#_container
         * @protected
         */
        value: container
      },
      _node: {
        enumerable: false,
        configurable: false,
        get: () => {
          /**
           * @property {?Element} _node
           * @name View#_node
           * @private
           */
          return _node
        },
        set: (node) => {
          assertType(isNode(node) || isNull(node),
            'view:_node:set: `node` argument assert be a Node or Null, `%s` given',
            typeof node
          )
          _node = node
        }
      },
      /**
       * @property {boolean} _shouldInit
       * @name View#_shouldInit
       * @protected
       */
      _shouldInit: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _shouldInit
        },
        set: (v) => {
          assertType(!!isBoolean(v),
            'hotballoon:view:constructor: `_shouldInit` argument should be a boolean'
          )
          _shouldInit = v
        }
      },
      /**
       * @property {boolean} _shouldRender
       * @name View#_shouldRender
       * @protected
       */
      _shouldRender: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _shouldRender
        },
        set: (v) => {
          assertType(!!isBoolean(v),
            'hotballoon:view:constructor: `_shouldRender` argument should be a boolean'
          )
          _shouldRender = v
        }
      },
      /**
       * @property {boolean} _shouldMount
       * @name View#_shouldMount
       * @protected
       */
      _shouldMount: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _shouldMount
        },
        set: (v) => {
          assertType(!!isBoolean(v),
            'hotballoon:view:constructor: `_shouldMount` argument should be a boolean'
          )
          _shouldMount = v
        }
      },
      /**
       * @property {boolean} _shouldUpdate
       * @name View#_shouldUpdate
       * @protected
       */
      _shouldUpdate: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _shouldUpdate
        },
        set: (v) => {
          assertType(!!isBoolean(v),
            'hotballoon:view:constructor: `_shouldUpdate` argument should be a boolean'
          )
          _shouldUpdate = v
        }
      },
      /**
       * @property {Map<string, Element>} _nodeRefs
       * @name View#_nodeRefs
       * @protected
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
      }

    })
  }

  /**
   * @return {?Element}
   */
  template() {
    throw new CoreException('view should be override', 'METHOD_NOT_OVERRIDE')
  }

  /**
   *
   * @param {ElementDescription} element
   * @return {Element}
   */
  html(element) {
    return html(this, element.querySelector, element.params, this.document())
  }

  /**
   *
   * @description subscribe subView an events of this view
   * @param {StoreInterface} store
   * @param {View~updateCallback} clb
   */
  subscribeToStore(store, clb = (state) => true) {
    assertType(
      isFunction(clb),
      'hotballoon:' + this.constructor.name + ':subscribeToStore: `clb` argument should be callable'
    )
    if (!TypeCheck.isStoreBase(store)) {
      throw TypeError('store argument should be an instance of StoreInterface')
    }
    const token = store.listenChanged(
      (payload, type) => {
        if (clb(payload.data) === true) {
          this.dispatch(VIEW_STORE_CHANGED, payload)
          this.updateNode()
        }
      }
    )

    this._storesMap.set(
      store.storeId(),
      store
    )

    this._tokenEvent.push(
      store.storeId(),
      token
    )
  }

  /**
   *
   * @callback View~updateCallback
   * @param {StoreState} state
   * @return {boolean}
   */

  /**
   * @private
   * @description update the node reference of this View
   */
  [_update]() {
    this._nodeRefs.clear()
    const candidate = this.template()
    if (isNull(candidate)) {
      this[_replaceNode]()
    } else {

      $(candidate).setViewRef(this.ID)
      startReconcile(this.node, candidate, this.parentNode)
    }
  }

  updateNode() {
    if (this.isRendered() && this._shouldUpdate) {
      this.logger().log(
        this.logger().builder()
          .debug()
          .pushLog('UpdateNode : ' + this.ID)
          .pushLog(this.node),
        viewLogOptions
      )

      this.dispatch(VIEW_UPDATE, {})
      requestAFrame(() => this[_update]())
      this.dispatch(VIEW_UPDATED, {})
    }
    this._shouldUpdate = true
  }

  shouldNotUpdate() {
    this._shouldUpdate = false
  }

  /**
   * @private
   */
  [_render]() {
    this[_replaceNode]()
    this[_setNodeViewRef]()
  }

  /**
   * @return {Element} _node
   */
  render() {
    this.logger().log(
      this.logger().builder()
        .info()
        .pushLog('Render : ' + this.ID),
      viewLogOptions
    )

    if (this._shouldRender) {
      this.dispatch(VIEW_RENDER, {})
      this[_render]()
      this._rendered = true
      this.dispatch(VIEW_RENDERED, {})
    }

    this._shouldRender = true
    return this.node
  }

  shouldNotRender() {
    this._shouldRender = false
  }

  /**
   * @private
   */
  [_mount]() {
    if (!isNull(this.node)) {
      this.parentNode.appendChild(this.node)
    }
  }

  mount() {
    if (this._shouldMount) {
      this.dispatch(VIEW_MOUNT, {})
      this[_mount]()
      this._mounted = true
      this.dispatch(VIEW_MOUNTED, {})
    }

    this._shouldMount = true
  }

  /**
   *
   * @param {Element} element
   * @return {Element}
   */
  mountInto(element) {
    this.parentNode = element
    this.mount()
    return element
  }

  shouldNotMount() {
    this._shouldMount = false
  }

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
   * @return {Element}
   */
  nodeRef(key) {
    if (!this._nodeRefs.has(key)) {
      this._nodeRefs.set(key, this.document().getElementById(this.elementIdFromRef(key)))
    }
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
   * @param {Element} node
   * @return {Element}
   * @instance
   */
  addNodeRef(key, node) {
    if (!this._rendered && !this._nodeRefs.has(key)) {
      this._nodeRefs.set(key, node)
    }
    return this[_addNodeRef](key, node)
  }

  /**
   * @private
   * @param {String} key
   * @param {Element} node
   * @return {Element} node
   */
  [_addNodeRef](key, node) {
    $(node).setNodeRef(key)
    node.setAttribute(ATTRIBUTE_NODEREF, key)
    return node
  }

  /**
   * @private
   */
  [_setNodeViewRef]() {
    if (!isNull(this.node)) {
      $(this.node).setViewRef(this.ID)
    }
  }

  /**
   *
   * @return {string}
   */
  viewRef() {
    return this.ID
  }

  /**
   * @return {?Element} node
   */
  get node() {
    return this._node
  }

  remove() {
    this.logger().log(
      this.logger().builder()
        .info()
        .pushLog('Remove : ' + this.ID)
        .pushLog(this),
      viewLogOptions
    )
    this._nodeRefs.clear()

    if (!isNull(this._node)) {
      this._node.parentNode.removeChild(this._node)
      this._node = null
    }

    super.remove()
  }

  /**
   * @return {?Element} node
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
   * @return {string}
   */
  AppID() {
    return this._container.AppID()
  }

  /**
   *
   * @return {string}
   */
  componentID() {
    return this._container.componentID()
  }

  /**
   *
   * @return {Document}
   */
  document() {
    return this._container.document()
  }

  /**
   *
   * @return {string}
   */
  containerID() {
    return this._container.ID
  }

  /**
   *
   * @return {ViewPublicEventHandler}
   */
  on() {
    return new ViewPublicEventHandler(a => this._on(a))
  }

  /**
   *
   * @param {string} ref
   * @return {string}
   */
  elementIdFromRef(ref) {
    return Checksum.number32bit(
      `${symbolToString(this.AppID())}-${symbolToString(this.componentID())}-${symbolToString(this.containerID())}-${symbolToString(ref)}`
    ).toString()
  }

  /**
   *
   * @return {LoggerInterface}
   */
  logger() {
    return this.container().logger()
  }
}
