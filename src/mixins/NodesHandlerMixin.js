'use strict'
import {
  isNode,
  assert,
  MapOfInstance
} from 'flexio-jshelpers'
import {
  html
} from '../HotballoonElement/CreateHotBalloonElement'
import {
  select as $$
} from '../HotballoonElement/HotBalloonAttributeHandler'

/**
 *
 * @class
 * @description Mixin - handle a NodeElement property
 */
export const NodesHandlerMixin = (Base) => class extends Base {
  /**
   * @description Mixin - init
   * @param {View} View
   * @memberOf NodesHandlerMixin
   * @instance
   */
  NodesHandlerMixinInit(View) {
    /**
     * @private
     * @prop {MapOfInstance} _subViews
     * @description for register subView {hotballoon/View}
     */
    this._subViews = new MapOfInstance(View)

    /**
     * @private
     * @prop {Map} _nodeRefs
     * @description for register reference to NodeElement {NodeElement}
     */
    this._nodeRefs = new Map()

    /**
     * @private
     * @prop {NodeElement} _node
     * @description NodeElement from the view() rendered
     *
     */
    var _node = null
    Object.defineProperty(
      this,
      '_node', {
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
      }
    )

    this.html = (querySelector, ...args) => {
      return html(this, querySelector, ...args)
    }
  }

  /**
   * @param {String} key
   * @param {View} view
   * @memberOf NodesHandlerMixin
   * @instance
   */
  registerSubView(key, view) {
    this._addSubView(key, view)
  }

  /**
   * @param {String} key
   * @param {View} view
   * @memberOf NodesHandlerMixin
   * @instance
   */
  addNodeSubView(key, view) {
    this._setNodeViewRef()
    this._addSubView(key, view)
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
   * @param {View} view
   * @return {View} view
   * @memberOf NodesHandlerMixin
   * @instance
   */
  _addSubView(key, view) {
    assert(key,
      'hoballoon:View:_addSubView: `key` argument assert not be undefined')
    this._subViews.set(key, view)
    this._suscribeToEvent(key, view)
    view.render()
    return view
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
    $$(node).setNodeRef(key)
    this._nodeRefs.set(key, node)
    node.setAttribute('_hb_noderef', key)
    return node
  }

  /**
   * @private
   * @memberOf NodesHandlerMixin
   * @instance
   */
  _setNodeViewRef() {
    $$(this.node()).setViewRef(this._ID)
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
