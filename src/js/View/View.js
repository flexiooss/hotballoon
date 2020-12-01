import {CoreException} from '../CoreException'
import {Checksum, UID} from '@flexio-oss/js-commons-bundle/js-helpers'
import {CLASS_TAG_NAME, CLASS_TAG_NAME_VIEW} from '../Types/HasTagClassNameInterface'
import {
  assertType,
  isNode,
  isNull,
  TypeCheck as TypeTypeCheck
} from '@flexio-oss/js-commons-bundle/assert'
import {symbolToString} from '@flexio-oss/js-commons-bundle/js-type-helpers'
import {$} from '../HotballoonNodeElement/HotBalloonAttributeHandler'
import {startReconcile} from '../HotballoonNodeElement/HotballoonElementReconciliation'
import {html} from '../HotballoonNodeElement/CreateHotBalloonElement'
import {ViewContainerBase} from './ViewContainerBase'
import {TypeCheck} from '../Types/TypeCheck'
import {
  VIEW_MOUNT,
  VIEW_MOUNTED,
  VIEW_RENDER,
  VIEW_RENDERED,
  VIEW_STORE_CHANGED,
  VIEW_UPDATE,
  VIEW_UPDATED,
  VIEW_REMOVE,
  ViewPublicEventHandler
} from './ViewPublicEventHandler'


export const ATTRIBUTE_NODEREF = '_hb_noderef'

const viewLogOptions = {
  color: 'blue',
  titleSize: 2
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
    super(UID('View__' + container.constructor.name + '_'))

    assertType(TypeCheck.isViewContainerBase(container), '`container` should be ViewContainerBase')
    /**
     * @type {Element}
     */
    this.parentNode = container.parentNode
    /**
     * @type {?Node}
     * @private
     */
    let _node = null
    /**
     * @type {boolean}
     * @private
     */
    let _shouldInit = true
    /**
     * @type {boolean}
     * @private
     */
    let _shouldRender = true
    /**
     * @type {boolean}
     * @private
     */
    let _shouldMount = true
    /**
     * @type {boolean}
     * @private
     */
    let _shouldUpdate = true
    /**
     * @type {boolean}
     * @private
     */
    let _synchronousUpdate = false
    /**
     * @type {boolean}
     * @private
     */
    let _synchronousRender = false
    /**
     * @type {Map<string, Element>}
     * @private
     */
    const _nodeRefs = new Map()
    /**
     * @type {number}
     * @private
     */
    let _updateRequests = 0

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
            '`node` should be a Node or Null, `%s` given',
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
        get: () => _shouldInit,
        set: (v) => {
          _shouldInit = TypeTypeCheck.assertIsBoolean(v)
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
        get: () => _shouldRender,
        set: (v) => {
          _shouldRender = TypeTypeCheck.assertIsBoolean(v)
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
          _shouldMount = TypeTypeCheck.assertIsBoolean(v)
        }
      },
      /**
       * @property {boolean} _synchronousUpdate
       * @name View#_synchronousUpdate
       * @protected
       */
      _synchronousUpdate: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _synchronousUpdate
        },
        set: (v) => {
          _synchronousUpdate = TypeTypeCheck.assertIsBoolean(v)
        }
      },
      /**
       * @property {boolean} _synchronousRender
       * @name View#_synchronousRender
       * @protected
       */
      _synchronousRender: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _synchronousRender
        },
        set: (v) => {
          _synchronousRender = TypeTypeCheck.assertIsBoolean(v)
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
          _shouldUpdate = TypeTypeCheck.assertIsBoolean(v)
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
      },
      /**
       * @property {number} _updateRequests
       * @name View#_nodeRefs
       * @protected
       */
      _updateRequests: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _updateRequests
        },
        set: (v) => {

          _updateRequests = TypeTypeCheck.assertIsNumber(v)
        }
      }

    })

    container.addView(this)
  }

  /**
   * @return {?Element}
   */
  template() {
    throw new CoreException('fieldView should be override', 'METHOD_NOT_OVERRIDE')
  }

  /**
   *
   * @param {ElementDescription} element
   * @return {Element}
   */
  html(element) {
    return html(this, element.querySelector(), element.params(), this.viewRenderConfig().document())
  }

  /**
   * @template STORE_TYPE,STORE_TYPE_BUILDER
   * @description subscribe subView an events of this fieldView
   * @param {StoreInterface<STORE_TYPE,STORE_TYPE_BUILDER>} store
   * @param {function(data:StoreState<STORE_TYPE>):boolean} clb
   * @return {this}
   */
  subscribeToStore(store, clb = (state) => true) {
    TypeTypeCheck.assertIsFunction(clb)
    assertType(TypeCheck.isStoreBase(store), 'store  should StoreInterface'
    )

    /**
     * @type {ListenedStore}
     */
    const listenedStore = store.listenChanged(
      (payload, type) => {
        if (!this.isRemoved()) {
          if (clb(payload) === true) {
            this.dispatch(VIEW_STORE_CHANGED, payload)
            this.updateNode()
          }
        }
      }
    )

    this._storesMap.set(
      store.storeId(),
      store
    )

    this._tokenEvent.push(
      store.storeId(),
      listenedStore
    )

    return this
  }

  #update() {
    if (!this.isRemoved() && this._updateRequests === 1) {

      this._nodeRefs.clear()
      const candidate = this.template()

      if (isNull(candidate) || isNull(this.node())) {
        this.#replaceNode()
      } else {

        $(candidate).setViewRef(this.ID())

        if (startReconcile(this.node(), candidate, this.parentNode)) {
          this._node = candidate
        }

      }
      this.dispatch(VIEW_UPDATED, {})
      this.logger().log(
        this.logger().builder()
          .debug()
          .pushLog('UpdateNode : ' + this.ID())
          .pushLog(this.node()),
        viewLogOptions
      )
    }
    this._updateRequests--
  }

  /**
   *
   * @return {View}
   */
  updateNode() {
    if (this.isRendered() && this._shouldUpdate) {

      this.dispatch(VIEW_UPDATE, {})

      this._updateRequests++
      if (this.isSynchronous() || this.isSynchronousUpdate()) {
        this.#update()
      } else {
        this.viewRenderConfig().domAccessor().write(() => {
          this.#update()
        })
      }

    }
    this._shouldUpdate = true
    return this
  }

  /**
   *
   * @return {View}
   */
  setSynchronousRender() {
    this._synchronousRender = true
    return this
  }

  /**
   *
   * @return {View}
   */
  setSynchronousUpdate() {
    this._synchronousUpdate = true
    return this
  }

  /**
   * @return {View}
   */
  setSynchronous() {
    this.setSynchronousRender()
    this.setSynchronousUpdate()
    return this
  }

  /**
   * @return {boolean}
   */
  isSynchronous() {
    return this.isSynchronousRender() && this.isSynchronousUpdate()
  }

  /**
   * @return {boolean}
   */
  isSynchronousRender() {
    return this._synchronousRender === true
  }

  /**
   * @return {boolean}
   */
  isSynchronousUpdate() {
    return this._synchronousUpdate === true
  }

  /**
   * @return {View}
   */
  shouldNotUpdate() {
    this._shouldUpdate = false
    return this
  }

  /**
   * @private
   */
  #render() {
    this.#replaceNode()
    this.#setNodeViewRef()
  }

  /**
   * @return {Element}
   */
  render() {
    this.logger().log(
      this.logger().builder()
        .info()
        .pushLog('Render : ' + this.ID()),
      viewLogOptions
    )

    if (this._shouldRender) {
      this.dispatch(VIEW_RENDER, {})
      this.#render()
      this._rendered = true
      this.dispatch(VIEW_RENDERED, {})
    }

    this._shouldRender = true

    return this.node()
  }

  /**
   * @return {View}
   */
  shouldNotRender() {
    this._shouldRender = false
    return this
  }

  /**
   * @private
   */
  #mount() {
    if (!isNull(this.node)) {
      this.parentNode.appendChild(this.node())
    }
    this._mounted = true
    this.dispatch(VIEW_MOUNTED, {})
    this._shouldMount = true

  }

  mount() {
    if (this._shouldMount) {
      this.dispatch(VIEW_MOUNT, {})

      if (this.isSynchronous() || this.isSynchronousRender()) {
        this.#mount()
      } else {
        this.viewRenderConfig().domAccessor().write(() => {
          this.#mount()
        })
      }

    } else {
      this._shouldMount = true
    }

  }

  /**
   * @param {Element} element
   * @return {Element}
   */
  mountInto(element) {
    this.parentNode = element
    this.mount()
    return element
  }

  /**
   * @return {View}
   */
  shouldNotMount() {
    this._shouldMount = false
    return this
  }

  /**
   * @return {View}
   */
  renderAndMount() {
    this.render()
    this.mount()
    return this
  }

  /**
   * @param {String} key
   * @param {View} view
   * @return {this}
   */
  addNodeView(key, view) {
    this.#setNodeViewRef()
    return this
  }

  /**
   * @param {String} key
   * @return {Element}
   */
  nodeRef(key) {
    if (!this._nodeRefs.has(key)) {
      /**
       * @type {?HTMLElement}
       */
      let element = this.viewRenderConfig().document().getElementById(this.elementIdFromRef(key))
      if (isNull(element)) {
        element = this.parentNode.querySelector('#' + this.elementIdFromRef(key))
      }
      this._nodeRefs.set(key, element)
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
   */
  addNodeRef(key, node) {
    if (!this._rendered && !this._nodeRefs.has(key)) {
      this._nodeRefs.set(key, node)
    }
    return this.#addNodeRef(key, node)
  }

  /**
   * @private
   * @param {String} key
   * @param {Element} node
   * @return {Element} node
   */
  #addNodeRef(key, node) {
    $(node).setNodeRef(key)
    if (this.viewRenderConfig().debug()) {
      node.setAttribute(ATTRIBUTE_NODEREF, key)
    }
    return node
  }

  /**
   * @private
   */
  #setNodeViewRef() {
    if (!isNull(this.node())) {
      $(this.node()).setViewRef(this.ID())
    }
  }

  /**
   * @return {string}
   */
  viewRef() {
    return this.ID()
  }

  /**
   * @return {?Element}
   */
  node() {
    return this._node
  }

  /**
   * @return {?Element} node
   */
  #replaceNode() {
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
   * @return {string}
   */
  AppID() {
    return this._container.AppID()
  }

  /**
   * @return {string}
   */
  componentID() {
    return this._container.componentID()
  }

  /**
   * @return {ViewRenderConfig}
   */
  viewRenderConfig() {
    return this._container.viewRenderConfig()
  }

  /**
   * @return {string}
   */
  containerID() {
    return this._container.ID()
  }

  /**
   * @return {ViewPublicEventHandler}
   */
  on() {
    return new ViewPublicEventHandler(a => this._on(a))
  }

  /**
   * @param {string} ref
   * @return {string}
   */
  elementIdFromRef(ref) {
    return '_' + Checksum.number32bit(
      `${symbolToString(this.AppID())}-${symbolToString(this.componentID())}-${symbolToString(this.containerID())}-${symbolToString(ref)}`
    ).toString() + '_'
  }

  /**
   * @return {LoggerInterface}
   */
  logger() {
    return this.container().logger()
  }

  remove() {
    this._removed = true
    this.logger().log(
      this.logger().builder()
        .info()
        .pushLog('Remove : ' + this.ID())
        .pushLog(this),
      viewLogOptions
    )
    this.dispatch(VIEW_REMOVE, {})

    this._nodeRefs.clear()

    if (this.isSynchronous() || this.isSynchronousUpdate()) {
      this.#removeNode()
    } else {
      this.viewRenderConfig().domAccessor().write(
        () => {
          this.#removeNode()
        }
      )
    }

    super.remove()
    this.container().removeView(this)
  }

  /**
   * @return {View}
   */
  unMount() {
    if (!isNull(this.node())) {
      this.parentNode.removeChild(this.node())
    }
    this._mounted = false
    return this
  }

  /**
   * @return {View}
   */
  #removeNode() {
    this.unMount()
    this._node = null
    return this
  }
}
