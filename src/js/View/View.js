import {Checksum, UID, UIDMini} from '@flexio-oss/js-commons-bundle/js-helpers/index.js'
import {CLASS_TAG_NAME, CLASS_TAG_NAME_VIEW} from '../Types/HasTagClassNameInterface.js'
import {
  assertType, formatType, isNode,
  isNull, NotOverrideException, TypeCheck
} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {symbolToString} from '@flexio-oss/js-commons-bundle/js-type-helpers/index.js'
import {$} from '../HotballoonNodeElement/HotBalloonAttributeHandler.js'
import {startReconcile} from '../HotballoonNodeElement/HotballoonElementReconciliation.js'
import {html} from '../HotballoonNodeElement/CreateHotBalloonElement.js'
import {ViewContainerBase} from './ViewContainerBase.js'
import {TypeCheck as HBTypeCheck} from '../Types/TypeCheck.js'
import {
  VIEW_MOUNT,
  VIEW_MOUNTED,
  VIEW_RENDER,
  VIEW_RENDERED,
  VIEW_STORE_CHANGED,
  VIEW_UPDATE,
  VIEW_UPDATED,
  VIEW_REMOVE,
  ViewPublicEventHandler, VIEW_UNMOUNT
} from './ViewPublicEventHandler.js'
import {RemovedException} from "../Exception/RemovedException.js";
import {Logger} from '@flexio-oss/js-commons-bundle/hot-log/index.js';
import {e} from "../HotballoonNodeElement/ElementDescription.js";
import {DOMError} from '../Exception/DOMError.js'
import {ViewPublicEventUnSubscriber} from "./ViewPublicEventUnSubscriber.js";

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
   * @protected
   */
  _shouldRender = true
  /**
   * @type {boolean}
   * @protected
   */
  _shouldMount = true
  /**
   * @type {boolean}
   * @protected
   */
  _shouldUpdate = true
  /**
   * @type {boolean}
   * @protected
   */
  _synchronousUpdate = false
  /**
   * @type {boolean}
   * @protected
   */
  _synchronousRender = false
  /**
   * @type {Map<string, Element>}
   * @protected
   */
  _nodeRefs = new Map()
  /**
   * @protected
   * @type {number}
   */
  _updateRequests = 0
  /**
   * @type {Logger}
   */
  _logger = Logger.getLogger(this.constructor.name, 'HotBalloon.View')

  /**
   * @param {ViewContainerBase} container
   */
  constructor(container) {
    assertType(HBTypeCheck.isViewContainerBase(container), '`container` should be ViewContainerBase')
    super(UIDMini('View__' + (container.constructor.name).replace(/\W*/ig, '') + '_'))

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
   * @return {?(Element|Element[])}
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
      builder => builder
        .callback((payload, type) => {
            if (!this.isRemoved()) {
              if (clb.call(null, payload) === true) {
                this.dispatch(VIEW_STORE_CHANGED, payload)
                this.updateNode()
              }
            }
          }
        )
        .guard(guard)
        .build()
    )
  }

  /**
   * @protected
   */
  _updateExe() {
    if (!this.isRemoved() && this._updateRequests === 1) {

      this._nodeRefs.clear()
      /**
       * @type {?Element}
       */
      const candidate = this.buildTemplate()

      if (isNull(candidate) || isNull(this.node())) {
        if (!isNull(candidate)) {
          this._replaceNode(candidate)
          this.mount()
        } else {
          this._removeNode()
        }
      } else {

        $(candidate).setViewRef(this.ID())

        if (startReconcile(this.node(), candidate, this.parentNode)) {
          this.#node = candidate
        }
      }

      this.dispatch(VIEW_UPDATED, {})
      this._logger.debug('UpdateNode : ' + this.ID())
    }
    this._updateRequests--
  }

  /**
   * @return {this}
   * @throws {RemovedException}
   */
  updateNode() {
    if (this.isRemoved()) {
      throw RemovedException.VIEW_CONTAINER(this._ID)
    }
    if (this.isRendered() && this._shouldUpdate) {

      this.dispatch(VIEW_UPDATE, {})

      this._updateRequests++
      if (this.isSynchronous() || this.isSynchronousUpdate()) {
        this._updateExe()
      } else {
        this.viewRenderConfig().domAccessor().write(() => {
          this._updateExe()
        })
      }
    }
    this._shouldUpdate = true
    return this
  }

  /**
   * @return {this}
   */
  setSynchronousRender() {
    this._synchronousRender = true
    return this
  }

  /**
   * @return {this}
   */
  setSynchronousUpdate() {
    this._synchronousUpdate = true
    return this
  }

  /**
   * @return {this}
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
   * @return {this}
   */
  shouldNotUpdate() {
    this._shouldUpdate = false
    return this
  }

  /**
   * @protected
   */
  _renderExe() {
    this._replaceNode()
    this.#setNodeViewRef()
  }

  /**
   * @return {?Element}
   * @throws {RemovedException}
   */
  render() {
    if (this.isRemoved()) {
      throw RemovedException.VIEW_CONTAINER(this.ID())
    }
    this._logger.info('Render : ' + this.ID(), this)

    if (this._shouldRender) {
      this.dispatch(VIEW_RENDER, {})
      this._renderExe()
      this._rendered = true
      this.dispatch(VIEW_RENDERED, {})
    }

    this._shouldRender = true

    return this.node()
  }

  /**
   * @return {this}
   */
  shouldNotRender() {
    this._shouldRender = false
    return this
  }

  /**
   * @protected
   */
  _appendChild() {
    if (this.isRemoved()) {
      return
    }
    if (!isNull(this.node())) {
      this.parentNode.appendChild(this.node())
    }
    this._mounted = true
    this._shouldMount = true
    this.dispatch(VIEW_MOUNTED, {})
  }

  /**
   * @throws {RemovedException}
   */
  mount() {
    if (this.isRemoved()) {
      throw RemovedException.VIEW_CONTAINER(this._ID)
    }
    if (this._shouldMount) {
      this.dispatch(VIEW_MOUNT, {})

      if (this.isSynchronous() || this.isSynchronousRender()) {
        this._appendChild()
      } else {
        this.viewRenderConfig().domAccessor().write(() => {
          this._appendChild()
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
    if (this.isMounted() && element === this.parentNode) return element
    this.parentNode = element
    this.mount()
    return element
  }

  /**
   * @return {this}
   */
  shouldNotMount() {
    this._shouldMount = false
    return this
  }

  /**
   * @return {this}
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
   * @protected
   */
  _replaceNode(candidate = null) {
    this.#node = candidate ?? this.buildTemplate()
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
      throw  DOMError.fromError(e)
    }

    return TypeCheck.assertIsNodeOrNull(template)
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
   * @return {SchedulerHandler}
   */
  scheduler() {
    return this.#container.scheduler()
  }

  /**
   * @return {IntersectionObserverHandler}
   */
  intersectionObserverHandler() {
    return this.#container.intersectionObserverHandler()
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
   * @return {ViewPublicEventUnSubscriber}
   */
  off() {
    return new ViewPublicEventUnSubscriber((a, b) => this._off(a, b))
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
    this._logger.info('Remove : ' + this.ID())
    this.dispatch(VIEW_REMOVE, {})

    this._nodeRefs.clear()

    if (this.isSynchronous() || this.isSynchronousUpdate()) {
      this._removeNode()
    } else {
      this.viewRenderConfig().domAccessor().write(
        () => {
          this._removeNode()
        }
      )
    }

    super.remove()
    this.container().removeView(this)
  }

  /**
   * @return {this}
   */
  unMount() {
    if (!isNull(this.node()) && !isNull(this.node().parentNode)) {
      this.dispatch(VIEW_UNMOUNT, {})
      this.parentNode.removeChild(this.node())
    }
    this._mounted = false
    return this
  }

  /**
   * @return {this}
   * @protected
   */
  _removeNode() {
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
  __CANVAS__(elementBuilder = null) {
    return this.#buildElement(elementBuilder, e('canvas'))
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

  /**
   * @param {?function(ElementDescription):ElementDescription} [elementBuilder=null]
   * @return {Element}
   */
  __ICON__(elementBuilder = null) {
    return this.#buildElement(elementBuilder, e('i'))
  }

  /**
   * @param {?function(ElementDescription):ElementDescription} [elementBuilder=null]
   * @return {Element}
   */
  __I__(elementBuilder = null) {
    return this.#buildElement(elementBuilder, e('i'))
  }

  /**
   * @param {?function(ElementDescription):ElementDescription} [elementBuilder=null]
   * @return {Element}
   */
  __LABEL__(elementBuilder = null) {
    return this.#buildElement(elementBuilder, e('label'))
  }

  /**
   * @param {?function(ElementDescription):ElementDescription} [elementBuilder=null]
   * @return {Element}
   */
  __TABLE__(elementBuilder = null) {
    return this.#buildElement(elementBuilder, e('table'))
  }

  /**
   * @param {?function(ElementDescription):ElementDescription} [elementBuilder=null]
   * @return {Element}
   */
  __TR__(elementBuilder = null) {
    return this.#buildElement(elementBuilder, e('tr'))
  }

  /**
   * @param {?function(ElementDescription):ElementDescription} [elementBuilder=null]
   * @return {Element}
   */
  __TD__(elementBuilder = null) {
    return this.#buildElement(elementBuilder, e('td'))
  }

  /**
   * @param {?function(ElementDescription):ElementDescription} [elementBuilder=null]
   * @return {Element}
   */
  __TBODY__(elementBuilder = null) {
    return this.#buildElement(elementBuilder, e('tbody'))
  }

  /**
   * @param {?function(ElementDescription):ElementDescription} [elementBuilder=null]
   * @return {Element}
   */
  __THEAD__(elementBuilder = null) {
    return this.#buildElement(elementBuilder, e('thead'))
  }

  /**
   * @param {?function(ElementDescription):ElementDescription} [elementBuilder=null]
   * @return {Element}
   */
  __TH__(elementBuilder = null) {
    return this.#buildElement(elementBuilder, e('th'))
  }

  /**
   * @param {?function(ElementDescription):ElementDescription} [elementBuilder=null]
   * @return {Element}
   */
  __TFOOT__(elementBuilder = null) {
    return this.#buildElement(elementBuilder, e('tfoot'))
  }

 /**
   * @param {?function(ElementDescription):ElementDescription} [elementBuilder=null]
   * @return {Element}
   */
  __VIDEO__(elementBuilder = null) {
    return this.#buildElement(elementBuilder, e('video'))
  }


}

