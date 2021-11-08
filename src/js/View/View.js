import {Checksum, UID} from '@flexio-oss/js-commons-bundle/js-helpers'
import {CLASS_TAG_NAME, CLASS_TAG_NAME_VIEW} from '../Types/HasTagClassNameInterface'
import {
  assertType,
  isNode,
  isNull, NotOverrideException,
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
import {RemovedException} from "../Exception/RemovedException";


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
   * @type {ViewContainerBase}
   */
  #container
  /**
   * @type {?Element}
   */
  #node = null
  /**
   * @type {boolean}
   */
  #shouldRender = true
  /**
   * @type {boolean}
   */
  #shouldMount = true
  /**
   * @type {boolean}
   */
  #shouldUpdate = true
  /**
   * @type {boolean}
   */
  #synchronousUpdate = false
  /**
   * @type {boolean}
   */
  #synchronousRender = false
  /**
   * @type {Map<string, Element>}
   */
  #nodeRefs = new Map()
  /**
   * @type {number}
   */
  #updateRequests = 0

  /**
   * @param {ViewContainerBase} container
   */
  constructor(container) {
    assertType(TypeCheck.isViewContainerBase(container), '`container` should be ViewContainerBase')
    super(UID('View__' + container.constructor.name + '_'), container.logger())

    this.#container = container
    this.parentNode = container.parentNode

    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_VIEW
    })

    container.addView(this)
  }

  /**
   * @return {?Element}
   * @abstract
   */
  template() {
    NotOverrideException.FROM_ABSTRACT('Hotballoon/View::template()')
  }

  /**
   * @return {?String}
   * @throws {RemovedException}
   */
  templateToString() {
    if (this.isRemoved()) {
      throw RemovedException.VIEW_CONTAINER(this._ID)
    }
    /**
     * @type {?Element}
     */
    const template = this.template()
    return !isNull(template) ? template.outerHTML : null
  }

  /**
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
   * @return {ListenedStore}
   * @throws {RemovedException}
   */
  subscribeToStore(store, clb = (state) => true) {
    if (this.isRemoved()) {
      throw RemovedException.VIEW_CONTAINER(this._ID)
    }
    return this.stores().listen(store, (payload, type) => {
      if (!this.isRemoved()) {
        if (clb.call(null, payload) === true) {
          this.dispatch(VIEW_STORE_CHANGED, payload)
          this.updateNode()
        }
      }
    })
  }

  #update() {
    if (!this.isRemoved() && this.#updateRequests === 1) {

      this.#nodeRefs.clear()
      /**
       * @type {?Element}
       */
      const candidate = this.template()

      if (isNull(candidate) || isNull(this.node())) {
        this.#replaceNode()
      } else {

        $(candidate).setViewRef(this.ID())

        if (startReconcile(this.node(), candidate, this.parentNode)) {
          this.#node = candidate
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
    this.#updateRequests--
  }

  /**
   * @return {View}
   * @throws {RemovedException}
   */
  updateNode() {
    if (this.isRemoved()) {
      throw RemovedException.VIEW_CONTAINER(this._ID)
    }
    if (this.isRendered() && this.#shouldUpdate) {

      this.dispatch(VIEW_UPDATE, {})

      this.#updateRequests++
      if (this.isSynchronous() || this.isSynchronousUpdate()) {
        this.#update()
      } else {
        this.viewRenderConfig().domAccessor().write(() => {
          this.#update()
        })
      }
    }
    this.#shouldUpdate = true
    return this
  }

  /**
   * @return {View}
   */
  setSynchronousRender() {
    this.#synchronousRender = true
    return this
  }

  /**
   * @return {View}
   */
  setSynchronousUpdate() {
    this.#synchronousUpdate = true
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
    return this.#synchronousRender === true
  }

  /**
   * @return {boolean}
   */
  isSynchronousUpdate() {
    return this.#synchronousUpdate === true
  }

  /**
   * @return {View}
   */
  shouldNotUpdate() {
    this.#shouldUpdate = false
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
   * @throws {RemovedException}
   */
  render() {
    if (this.isRemoved()) {
      throw RemovedException.VIEW_CONTAINER(this._ID)
    }
    this.logger().log(
      this.logger().builder()
        .info()
        .pushLog('Render : ' + this.ID()),
      viewLogOptions
    )

    if (this.#shouldRender) {
      this.dispatch(VIEW_RENDER, {})
      this.#render()
      this._rendered = true
      this.dispatch(VIEW_RENDERED, {})
    }

    this.#shouldRender = true

    return this.node()
  }

  /**
   * @return {View}
   */
  shouldNotRender() {
    this.#shouldRender = false
    return this
  }

  #appendChild() {
    if (this.isRemoved()) {
      return
    }
    if (!isNull(this.node)) {
      this.parentNode.appendChild(this.node())
    }
    this._mounted = true
    this.#shouldMount = true
    this.dispatch(VIEW_MOUNTED, {})
  }

  /**
   * @throws {RemovedException}
   */
  mount() {
    if (this.isRemoved()) {
      throw RemovedException.VIEW_CONTAINER(this._ID)
    }
    if (this.#shouldMount) {
      this.dispatch(VIEW_MOUNT, {})

      if (this.isSynchronous() || this.isSynchronousRender()) {
        this.#appendChild()
      } else {
        this.viewRenderConfig().domAccessor().write(() => {
          this.#appendChild()
        })
      }
    } else {
      this.#shouldMount = true
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
    this.#shouldMount = false
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
   * @throws {RemovedException}
   */
  nodeRef(key) {
    if (this.isRemoved()) {
      throw RemovedException.VIEW_CONTAINER(this._ID)
    }
    if (!this.#nodeRefs.has(key)) {
      /**
       * @type {?HTMLElement}
       */
      let element = this.viewRenderConfig().document().getElementById(this.elementIdFromRef(key))
      if (isNull(element)) {
        element = this.parentNode.querySelector('#' + this.elementIdFromRef(key))
      }
      this.#nodeRefs.set(key, element)
    }
    return this.#nodeRefs.get(key)
  }

  /**
   * @alias nodeRef
   * @param {String} key
   * @return {HotBalloonAttributeHandler}
   */
  $(key) {
    return $(this.#nodeRefs.get(key))
  }

  /**
   * @param {String} key
   * @param {Element} node
   * @return {Element}
   */
  addNodeRef(key, node) {
    if (!this._rendered && !this.#nodeRefs.has(key)) {
      this.#nodeRefs.set(key, node)
    }
    return this.#addNodeRef(key, node)
  }

  /**
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
    return this.#node
  }

  /**
   * @return {?Element} node
   */
  #replaceNode() {
    this.#node = this.template()
    return this.#node
  }

  /**
   * @return {ViewContainerBase}
   */
  container() {
    return this.#container
  }

  /**
   * @return {string}
   */
  AppID() {
    return this.#container.AppID()
  }

  /**
   * @return {string}
   */
  componentID() {
    return this.#container.componentID()
  }

  /**
   * @return {ViewRenderConfig}
   */
  viewRenderConfig() {
    return this.#container.viewRenderConfig()
  }

  /**
   * @return {string}
   */
  containerID() {
    return this.#container.ID()
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

  remove() {
    this.logger().log(
      this.logger().builder()
        .info()
        .pushLog('Remove : ' + this.ID())
        .pushLog(this),
      viewLogOptions
    )
    this.dispatch(VIEW_REMOVE, {})

    this.#nodeRefs.clear()

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
    if (!isNull(this.node()) && !isNull(this.node().parentNode)) {
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
    this.#node = null
    return this
  }
}
