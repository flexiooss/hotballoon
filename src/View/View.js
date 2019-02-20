'use strict'
import {CoreException} from '../CoreException'
import {CLASS_TAG_NAME, CLASS_TAG_NAME_VIEW} from '../HasTagClassNameInterface'
import {assert, isBoolean, isFunction, isNode, isPrimitive} from 'flexio-jshelpers'
import {$} from '../HotballoonNodeElement/HotBalloonAttributeHandler'
import {startReconcile} from '../HotballoonNodeElement/HotballoonElementReconciliation'
import {html} from '../HotballoonNodeElement/CreateHotBalloonElement'
import {ViewContainerBase} from './ViewContainerBase'
import {STORE_CHANGED} from '../Store/StoreInterface'
import {EventListenerOrderedFactory} from '../Event/EventListenerOrderedFactory'
import {TypeCheck} from '../TypeCheck'

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

    assert(
      viewParameters instanceof ViewParameters,
      'hotballoon:' + this.constructor.name + ':constructor: `viewParameters` should be an instance of ViewParameters'
    )

    this.debug.color = 'blue'
    this.parentNode = viewParameters.container.parentNode

    var _node = null
    var _shouldInit = true
    var _shouldRender = true
    var _shouldMount = true
    const _nodeRefs = new Map()

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
           * @property {Element} _node
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
      }

    })
  }

  /**
   * @static
   * @param {ViewParameters} viewParameters
   * @return View
   */
  static create(viewParameters) {
    return new this(viewParameters)
  }

  /**
   *
   * @static
   * @param {ViewParameters} viewParameters
   * @param {Element} parentNode
   * @return View
   */
  static createWithParentNode(viewParameters, parentNode) {
    const inst = new this(viewParameters)
    inst.parentNode = parentNode
    return inst
  }

  /**
   * @return {Element}
   */
  template() {
    throw new CoreException('view should be override', 'METHOD_NOT_OVERRIDE')
  }

  /**
   *
   * @param {String} querySelector
   * @param {HotballoonElementParams} hotballoonElementParams
   * @return {Element}
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
    assert(
      isFunction(clb),
      'hotballoon:' + this.constructor.name + ':subscribeToStore: `clb` argument should be callable'
    )
    if (!TypeCheck.isStoreBase(store)) {
      throw TypeError('store argument should be an instance of StoreInterface')
    }

    this._tokenEvent.add(
      store.storeId(),
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
    const candidate = this.template()
    $(candidate).setViewRef(this.ID)
    startReconcile(this.node, candidate, this.parentNode)
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
   * @return {Element} _node
   */
  render() {
    this.debug.log('render').size(2)
    this.debug.print()

    if (this._shouldRender) {
      this[_render]()
      this._rendered = true
    }
    console.log(this)
    console.log(this.node)

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
    return this[_setNodeRef](key, node)
  }

  /**
   * @param {String} key
   * @param {Element} node
   * @return {Element}
   */
  replaceNodeRef(key, node) {
    return this[_setNodeRef](key, node)
  }

  /**
   * @private
   * @param {String} key
   * @param {Element} node
   * @return {Element} node
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
   *
   * @return {string}
   */
  viewRef() {
    return this.ID
  }

  /**
   * @return {Element} node
   */
  get node() {
    return this._node
  }

  /**
   * @return {Element} node
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
   * @return {string}
   */
  containerID() {
    return this._container.ID
  }
}

export {View}
