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
    assert(key,
      'hoballoon:View:_addSubView: `key` argument assert not be undefined')
    this._subViews.set(key, view)
    this._suscribeToEvent(key, view)
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
