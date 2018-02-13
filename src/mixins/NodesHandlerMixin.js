import {
  isNode,
  should,
  MapOfInstance
} from 'flexio-jshelpers'
import {
  select as $$
} from '../HotballoonElement/HotBalloonAttributeHandler'

export const NodesHandlerMixin = (Base) => class extends Base {
  /**
     *
     * @param {hotballoon:View} View
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
          should(isNode(node),
            'View:_node:set: `node` argument should be a Node, `%s` given',
            typeof node
          )
          _node = node
        }
      }
    )

    // this._createElement = CreateHotBalloonElement
  }
  /**
     *
     * --------------------------------------------------------------
     * Part
     * --------------------------------------------------------------
     */

  registerSubView(key, view) {
    this._addSubView(key, view)
  }
  addNodeSubView(key, view) {
    this._setNodeViewRef()
    this._addSubView(key, view)
  }

  subView(key) {
    return this._subViews.get(key)
  }

  nodeRef(key) {
    return this._nodeRefs.get(key)
  }

  addNodeRef(key, node) {
    return this._setNodeRef(key, node)
  }

  replaceNodeRef(key, node) {
    return this._setNodeRef(key, node)
  }

  _addSubView(key, view) {
    should(key,
      'hoballoon:View:_addSubView: `key` argument should not be undefined')
    this._subViews.add(view, key)
    this._suscribeToEvent(view, key)
    return view
  }

  _setNodeRef(key, node) {
    $$(node).setNodeRef(key)
    this._nodeRefs.set(key, node)
    return node
  }

  _setNodeViewRef() {
    $$(this.node()).setViewRef(this._ID)
  }

  /**
     *
     * --------------------------------------------------------------
     * Node
     * --------------------------------------------------------------
     */
  node() {
    return this._node
  }

  _replaceNode() {
    this._node = this.view()
    return this._node
  }
}
