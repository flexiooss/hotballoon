import {View} from "./View.js";
import {FlexArray} from "@flexio-oss/js-commons-bundle/flex-types/index.js";
import {
  assertInstanceOf,
  assertType,
  formatType,
  isNode,
  isNull,
  TypeCheck
} from "@flexio-oss/js-commons-bundle/assert/index.js";
import {
  removeChildNodes
} from "@flexio-oss/js-commons-bundle/js-type-helpers/index.js";
import {DOMError} from "../Exception/DOMError.js";
import {RemovedException} from "../Exception/RemovedException.js";
import {
  VIEW_MOUNT,
  VIEW_MOUNTED,
  VIEW_RENDER,
  VIEW_RENDERED,
  VIEW_UNMOUNT,
  VIEW_UPDATED
} from "./ViewPublicEventHandler.js";
import {e} from "../HotballoonNodeElement/ElementDescription.js";
import {startReconcile,startChildrenReconciliation} from "../HotballoonNodeElement/HotballoonElementReconciliation.js";

export class ViewFragment extends View {
  /**
   * @type {?Element}
   */
  #node = null

  static NodeArray() {
    return new NodeArray()
  }

  /**
   * @return {?DocumentFragment}
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
      throw DOMError.fromError(e)
    }
    if (isNull(template)) return null

    assertInstanceOf(template, NodeArray, 'NodeArray')
    /**
     * @type {DocumentFragment}
     */
    const fragment = this.viewRenderConfig().document().createDocumentFragment()
    fragment.append(...template)
    return fragment
  }

  /**
   * @return {Element}
   * @throws {RemovedException}
   */
  render() {
    super.render()
    return this.parentNode
  }

  /**
   * @protected
   */
  _renderExe() {
    this._replaceNode()
  }

  /**
   * @return {?DocumentFragment}
   */
  node() {
    return this.#node
  }

  /**
   * @return {?Element}
   */
  _replaceNode(candidate = null) {
    this.#node = candidate ?? this.buildTemplate()
    return this.#node
  }

  _appendChild() {
    super._appendChild();
    this.#node = null
  }

  /**
   * @param {Element} element
   * @return {Element}
   * @throws {RemovedException}
   */
  mountInto(element) {
    if (this.isRemoved()) {
      throw RemovedException.VIEW_CONTAINER(this._ID)
    }

    if (this.isMounted() && element === this.parentNode) return element
    if (!this.isMounted()) {
      this.parentNode = element
      this.mount()
    } else {
      if (this._shouldMount) {
        this.dispatch(VIEW_MOUNT, {})

        if (this.isSynchronous() || this.isSynchronousRender()) {
          this.#remountInto(element)
        } else {
          this.viewRenderConfig().domAccessor().write(() => {
            this.#remountInto(element)
          })
        }
      } else {
        this._shouldMount = true
      }
    }

    return element
  }

  /**
   * @param {Element}  element
   */
  #remountInto(element) {
    if (this.isRemoved()) {
      return
    }
    if (this.parentNode.hasChildNodes()) {
      /**
       * @type {NodeListOf<ChildNode>}
       */
      const children = this.parentNode.childNodes
      /**
       * @type {DocumentFragment}
       */
      const fragment = this.viewRenderConfig().document().createDocumentFragment()
      for (child of children) {
        fragment.appendChild(child)
      }
      element.appendChild(fragment)
    }
    this.parentNode = element
    this._mounted = true
    this._shouldMount = true
    this.dispatch(VIEW_MOUNTED, {})
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
   * @return {this}
   */
  unMount() {
    if (!isNull(this.parentNode)) {
      this.dispatch(VIEW_UNMOUNT, {})
      removeChildNodes(this.parentNode)
    }
    this._mounted = false
    return this
  }

  /**
   * @protected
   */
  _updateExe() {
    if (!this.isRemoved() && this._updateRequests === 1) {

      this._nodeRefs.clear()
      /**
       * @type {?DocumentFragment}
       */
      const candidate = this.buildTemplate()

      if (isNull(candidate) || !this.parentNode.hasChildNodes()) {
        if (!isNull(candidate)) {
          this._replaceNode(candidate)
          this.mount()
        } else {
          this._removeNode()
        }
      } else {
        startChildrenReconciliation(this.parentNode, candidate, this.parentNode)
      }

      this.dispatch(VIEW_UPDATED, {})
      this._logger.debug('UpdateNode : ' + this.ID())
    }
    this._updateRequests--
  }

}

class NodeArray extends FlexArray {
  _validate(v) {
    TypeCheck.assertIsNode(v)
  }
}
