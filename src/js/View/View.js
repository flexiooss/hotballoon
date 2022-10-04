import {Checksum, UID} from '@flexio-oss/js-commons-bundle/js-helpers'
import {CLASS_TAG_NAME, CLASS_TAG_NAME_VIEW} from '../Types/HasTagClassNameInterface'
import {
  assertType, formatType, isNode,
  isNull, NotOverrideException, TypeCheck
} from '@flexio-oss/js-commons-bundle/assert'
import {symbolToString} from '@flexio-oss/js-commons-bundle/js-type-helpers'
import {$} from '../HotballoonNodeElement/HotBalloonAttributeHandler'
import {startReconcile} from '../HotballoonNodeElement/HotballoonElementReconciliation'
import {html} from '../HotballoonNodeElement/CreateHotBalloonElement'
import {ViewContainerBase} from './ViewContainerBase'
import {TypeCheck as HBTypeCheck} from '../Types/TypeCheck'
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
import {Logger} from "@flexio-oss/js-commons-bundle/hot-log";
import {e} from "../HotballoonNodeElement/ElementDescription";
import {DOMError} from '../Exception/DOMError'

export const ATTRIBUTE_NODEREF = '_hb_noderef'

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
   * @type {Logger}
   */
  #logger = Logger.getLogger(this.constructor.name, 'HotBalloon.View')

  /**
   * @param {ViewContainerBase} container
   */
  constructor(container) {
    assertType(HBTypeCheck.isViewContainerBase(container), '`container` should be ViewContainerBase')
    super(UID('View__' + (container.constructor.name).replace(/\W*/ig, '') + '_'))

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
    const template = this.buildTemplate()
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
   * @param {?function(data:StoreState<STORE_TYPE>)} [guard=null]
   * @return {ListenedStore}
   * @throws {RemovedException}
   */
  subscribeToStore(store, clb = (state) => true, guard = null) {
    if (this.isRemoved()) {
      throw RemovedException.VIEW_CONTAINER(this._ID)
    }

    return this.stores().listen(
      store,
      (payload, type) => {
        if (!this.isRemoved()) {
          if (clb.call(null, payload) === true) {
            this.dispatch(VIEW_STORE_CHANGED, payload)
            this.updateNode()
          }
        }
      }, 100,
      guard
    )
  }

  #update() {
    if (!this.isRemoved() && this.#updateRequests === 1) {

      this.#nodeRefs.clear()
      /**
       * @type {?Element}
       */
      const candidate = this.buildTemplate()

      if (isNull(candidate) || isNull(this.node())) {
        this.#replaceNode()
      } else {

        $(candidate).setViewRef(this.ID())

        if (startReconcile(this.node(), candidate, this.parentNode)) {
          this.#node = candidate
        }
      }

      this.dispatch(VIEW_UPDATED, {})
      this.#logger.debug('UpdateNode : ' + this.ID())
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
    this.#logger.info('Render : ' + this.ID(), this)

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
   * @return {?Element}
   */
  #replaceNode() {
    this.#node = this.buildTemplate()
    return this.#node
  }

  /**
   * @return {?Element}
   * @throws {TypeError, DOMError}
   */
  buildTemplate() {
    /**
     * @type {?Element}
     */
    let template = null
    try {
      template = this.template()
    } catch (e) {
      throw new DOMError(JSON.stringify(e.stack))
    }
    assertType(
      isNull(template) || isNode(template),
      () => `View[${this.constructor.name}]:template() bad return type, should be ?Element given:${formatType(template)}`
    )
    return template
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
    this.#logger.info('Remove : ' + this.ID())
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

  /**
   * @param {?function(ElementDescription):ElementDescription} elementBuilder
   * @param {ElementDescription} elementBuilder
   * @return {Element}
   */
  #buildElement(elementBuilder, elementDesc) {
    return isNull(elementBuilder)
      ? this.html(elementDesc)
      : this.html(TypeCheck.assertIsArrowFunction(elementBuilder).call(null, elementDesc))
  }

  /**
   * @param {?function(ElementDescription):ElementDescription} [elementBuilder=null]
   * @return {Element}
   */
  __DIV__(elementBuilder = null) {
    return this.#buildElement(elementBuilder, e('div'))
  }

  /**
   * @param {?function(ElementDescription):ElementDescription} [elementBuilder=null]
   * @return {Element}
   */
  __SPAN__(elementBuilder = null) {
    return this.#buildElement(elementBuilder, e('span'))
  }

  /**
   * @param {?function(ElementDescription):ElementDescription} [elementBuilder=null]
   * @return {Element}
   */
  __P__(elementBuilder = null) {
    return this.#buildElement(elementBuilder, e('p'))
  }

  /**
   * @param {?function(ElementDescription):ElementDescription} [elementBuilder=null]
   * @return {Element}
   */
  __HEADER__(elementBuilder = null) {
    return this.#buildElement(elementBuilder, e('header'))
  }

  /**
   * @param {?function(ElementDescription):ElementDescription} [elementBuilder=null]
   * @return {Element}
   */
  __FOOTER__(elementBuilder = null) {
    return this.#buildElement(elementBuilder, e('footer'))
  }

  /**
   * @param {?function(ElementDescription):ElementDescription} [elementBuilder=null]
   * @return {Element}
   */
  __ASIDE__(elementBuilder = null) {
    return this.#buildElement(elementBuilder, e('aside'))
  }

  /**
   * @param {?function(ElementDescription):ElementDescription} [elementBuilder=null]
   * @return {Element}
   */
  __NAV__(elementBuilder = null) {
    return this.#buildElement(elementBuilder, e('nav'))
  }

  /**
   * @param {?function(ElementDescription):ElementDescription} [elementBuilder=null]
   * @return {Element}
   */
  __MAIN__(elementBuilder = null) {
    return this.#buildElement(elementBuilder, e('main'))
  }

  /**
   * @param {?function(ElementDescription):ElementDescription} [elementBuilder=null]
   * @return {Element}
   */
  __SECTION__(elementBuilder = null) {
    return this.#buildElement(elementBuilder, e('section'))
  }

  /**
   * @param {?function(ElementDescription):ElementDescription} [elementBuilder=null]
   * @return {Element}
   */
  __ARTICLE__(elementBuilder = null) {
    return this.#buildElement(elementBuilder, e('article'))
  }

  /**
   * @param {?function(ElementDescription):ElementDescription} [elementBuilder=null]
   * @return {Element}
   */
  __UL__(elementBuilder = null) {
    return this.#buildElement(elementBuilder, e('ul'))
  }

  /**
   * @param {?function(ElementDescription):ElementDescription} [elementBuilder=null]
   * @return {Element}
   */
  __OL__(elementBuilder = null) {
    return this.#buildElement(elementBuilder, e('ol'))
  }

  /**
   * @param {?function(ElementDescription):ElementDescription} [elementBuilder=null]
   * @return {Element}
   */
  __LI__(elementBuilder = null) {
    return this.#buildElement(elementBuilder, e('li'))
  }

  /**
   * @param {?function(ElementDescription):ElementDescription} [elementBuilder=null]
   * @return {Element}
   */
  __A__(elementBuilder = null) {
    return this.#buildElement(elementBuilder, e('a'))
  }

  /**
   * @param {?function(ElementDescription):ElementDescription} [elementBuilder=null]
   * @return {Element}
   */
  __IMG__(elementBuilder = null) {
    return this.#buildElement(elementBuilder, e('img'))
  }

  /**
   * @param {?function(ElementDescription):ElementDescription} [elementBuilder=null]
   * @return {Element}
   */
  __SVG__(elementBuilder = null) {
    return this.#buildElement(elementBuilder, e('svg'))
  }

  /**
   * @param {?function(ElementDescription):ElementDescription} [elementBuilder=null]
   * @return {Element}
   */
  __CODE__(elementBuilder = null) {
    return this.#buildElement(elementBuilder, e('code'))
  }

  /**
   * @param {?function(ElementDescription):ElementDescription} [elementBuilder=null]
   * @return {Element}
   */
  __PRE__(elementBuilder = null) {
    return this.#buildElement(elementBuilder, e('pre'))
  }

  /**
   * @param {?function(ElementDescription):ElementDescription} [elementBuilder=null]
   * @return {Element}
   */
  __INPUT__(elementBuilder = null) {
    return this.#buildElement(elementBuilder, e('input'))
  }

  /**
   * @param {?function(ElementDescription):ElementDescription} [elementBuilder=null]
   * @return {Element}
   */
  __BUTTON__(elementBuilder = null) {
    return this.#buildElement(elementBuilder, e('button'))
  }

  /**
   * @param {?function(ElementDescription):ElementDescription} [elementBuilder=null]
   * @return {Element}
   */
  __IFRAME__(elementBuilder = null) {
    return this.#buildElement(elementBuilder, e('iframe'))
  }
}
