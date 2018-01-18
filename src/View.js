import {
  ViewContainer
} from './ViewContainer'
import {
  CoreException
} from './CoreException'

import {
  render as DomRender
} from './helpers/domHelpers/domHelpers'

import {
  isNode
} from './helpers'
import {
  shouldIs
} from './shouldIs'

class View {
  constructor(container, props) {
    this.props = props
    this._node = null

    try {
      this._setContainer(container)
    } catch (e) {
      console.log(e.toString())
    }
  }

  _setContainer(container) {
    if (container instanceof ViewContainer) {
      this._container = container
    } else {
      throw new CoreException('View:_setContainer:container argument should be instance of hotballoon/Container', 'BAD_INHERIT_CLASS')
    }
  }
  getContainer() {
    return this._container
  }

  setProps(props) {
    this.props = props
  }

  setState(props) {
    this.setProps = props
  }

  getNode() {
    return this._createNode()
  }

  _createNode() {
    if (this._node === null) {
      this._node = this.view()
    }
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
}

export {
  View
}
