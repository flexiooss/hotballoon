import {
  isNode,
  hasParentPrototypeName,
  render as DomRender
} from './helpers'
import {
  shouldIs
} from './shouldIs'

class View {
  constructor(viewContainer, props) {
    this.props = props || {}
    this.rendered = false

    var _viewContainer = null
    Object.defineProperty(this, '_viewContainer', {
      enumerable: false,
      configurable: false,
      get: () => _viewContainer,
      set: (newViewContainer) => {
        shouldIs(!this._viewContainer,
          'View:_setContainer:viewContainer property already set'
        )
        shouldIs(hasParentPrototypeName(newViewContainer, 'ViewContainer'),
          'View:_setContainer:viewContainer argument should be instance of hotballoon/ViewContainer'
        )
        _viewContainer = newViewContainer
      }
    })

    var _node = null
    Object.defineProperty(this, '_node', {
      enumerable: false,
      configurable: false,
      get: () => {
        if (_node === null) {
          _node = this.view()
        }
        return _node
      },
      set: (node) => {
        shouldIs(isNode(node),
          'View:_node:set: `node` argument should be a Node'
        )
        _node = node
      }
    })

    this._viewContainer = viewContainer
  }

  getViewContainer() {
    return this._viewContainer
  }

  setProps(props) {
    this.props = props
  }

  setState(props) {
    this.setProps = props
  }

  getNode() {
    return this._node
  }

  replaceNode() {
    this._node = this.view()
    return this._node
  }

  update() {}
  /**
     * Define if the view
     * @private
     */
  _shouldUpdate() {
    return true
  }
  _beforeUpdate() {
    return true
  }
  _afterUpdate() {
    return true
  }

  updateNode() {
    if (!this._shouldUpdate()) {
      return false
    }
    if (!this._beforeUpdate()) {
      return false
    }

    this.update()

    if (!this._afterUpdate()) {
      return false
    }
  }

  _shouldRender() {
    return true
  }
  _beforeRender() {
    return true
  }
  _afterRender() {
    return true
  }

  _render(parentNode) {
    console.log('_render')
    console.log(this.getNode())
    console.log(this)
    DomRender(parentNode, this.getNode())
  }

  render(parentNode) {
    shouldIs(isNode(parentNode),
      'hotballoon:View:render require a Node argument'
    )

    if (!this._shouldRender()) {
      return false
    }

    if (!this._beforeRender()) {
      return false
    }

    this._render(parentNode)

    if (!this._afterRender()) {
      return false
    }
  }

  view() {}

  newAction(actionName, actionType, payload) {
    this._viewContainer.newViewAction(actionName, actionType, payload)
  }
}

export {
  View
}
