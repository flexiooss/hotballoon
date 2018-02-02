import {
  isNode,
  isFunction,
  camelCase,
  should,
  MapOfInstance,
  MapOfArray,
  render as DomRender
} from 'flexio-jshelpers'
import {
  EventHandler
} from './EventHandler'
import {
  PrivateStateMixin
} from './mixins/PrivateStateMixin'
import {
  ViewContainerContextMixin
} from './mixins/ViewContainerContextMixin'
const eventCallbackPrefix = 'on'
const StoreChangedEvent = 'StoreChanged'

class View extends ViewContainerContextMixin(PrivateStateMixin(class {})) {
  constructor(viewContainer, props) {
    super()
    this.ViewContainerContextMixinInit(viewContainer)
    this.PrivateStateMixinInit()

    this.props = props || {}
    this.privateState = {}
    this._isRendered = false

    /**
         * EventHandler : Internal event property with callable value
         * @property
         *
         * onInit
         * onUpdtate
         * onUpdtated
         * onRender
         * onRendered
         * onPropsChange
         * onPropsChanged
         * onStateChange
         * onStateChanged
         */
    this._EnventHandler = new EventHandler()
    this._initListeners()
    this._tokenEvent = new MapOfArray()

    this._shouldInit = true
    this._shouldUpdate = true
    this._shouldRender = true
    this._shouldChangeProps = true
    this._shouldChangeState = true

    this._parts = new MapOfInstance(View)
    this._partsNode = new Map()

    var _node = this.view()
    Object.defineProperty(this, '_node', {
      enumerable: false,
      configurable: false,
      get: () => {
        return _node
      },
      set: (node) => {
        should(isNode(node),
          'View:_node:set: `node` argument should be a Node'
        )
        _node = node
      }
    })

    this.onStoreChanged = (payload, type) => {
      console.group('onStoreChanged')
      console.log(type)
      console.log(payload)
      console.groupEnd()

      this.setProps(payload)
      this._dispatchStoreChanged(payload)
    }
  }

  view() {}

  /**
     *
     * --------------------------------------------------------------
     * EventHandler
     * --------------------------------------------------------------
     */

  static eventTypes(key) {
    const types = {
      INIT: 'INIT',
      UPDATE: 'UPDATE',
      UPDATED: 'UPDATED',
      RENDER: 'RENDER',
      RENDERED: 'RENDERED',
      PROPS_CHANGE: 'PROPS_CHANGE',
      PROPS_CHANGED: 'PROPS_CHANGED',
      STATE_CHANGE: 'STATE_CHANGE',
      STATE_CHANGED: 'STATE_CHANGED'
    }
    return (key) ? types[key] : types
  }

  _suscribeToEvent(part, key) {
    // console.log('events[i]')
    // console.log(events[i])
    let token = this.subscribe(
      StoreChangedEvent,
      (payload, type) => {
        // console.log('__ICI________________________________________________________________________')
        // console.log(this)
        // console.log(view)

        // if (view.hasOwnProperty('on' + events[i]) && view['on' + events[i]]) {
        // console.log('__LA________________________________________________________________________')
        part[eventCallbackPrefix + StoreChangedEvent](payload, type)
        // }
      },
      part, 100)

    this._tokenEvent.add(key, token)
  }

  _initListeners() {
    for (let eventType in View.eventTypes()) {
      this._EnventHandler.addEventListener(View.eventTypes()[eventType], (payload, type) => {
        var propName = eventCallbackPrefix + camelCase(type)
        if (this.hasOwnProperty(propName) && isFunction(this[propName])) {
          this[propName](payload)
        }
      })
    }
  }

  _dispatchStoreChanged(payload) {
    let countOfParts = this._parts.length
    for (let i = 0; i < countOfParts; i++) {
      this._parts[i].dispatch(StoreChangedEvent, payload)
    }
  }

  /**
     *
     * --------------------------------------------------------------
     * Part
     * --------------------------------------------------------------
     */

  registerPart(key, view) {
    this._addPart(key, view)
    this._addPartNode(key, view)
  }

  getPart(key) {
    return this._parts.get(key)
  }

  getPartNode(key) {
    return this._getPartNode(key)
  }

  addPartReference(key, node) {
    return this._addPartNode(key, node)
  }

  replacePartReference(key, node) {
    return this._setPartNode(key, node)
  }
  _addPart(key, view) {
    should(key,
      'hoballoon:ViewContainer:addView: `key` argument should not be undefined')
    this._parts.add(view, key)
    this._suscribeToEvent(view, key)
    return view
  }

  _addPartNode(key, node) {
    if (!this._partsNode.has(key)) {
      this._setPartNode(key, node)
      return node
    } else {
      return this._partsNode.get(key)
    }
  }
  _setPartNode(key, node) {
    this._partsNode.set(key, node)
    return node
  }

  _getPartNode(key) {
    return this._partsNode.get(key)
  }

  /**
     *
     * --------------------------------------------------------------
     * ViewContainer
     * --------------------------------------------------------------
     */

  newAction(actionName, actionType, payload) {
    this.ViewContainer().newViewAction(actionName, actionType, payload)
    return this
  }

  /**
     *
     * --------------------------------------------------------------
     * Prop & State
     * --------------------------------------------------------------
     */

  setProps(props) {
    this._EnventHandler.dispatch(View.eventTypes()['PROPS_CHANGE'], props)
    if (this._shouldChangeProps) {
      this.props = props
      this._EnventHandler.dispatch(View.eventTypes()['PROPS_CHANGED'], props)
      this.updateNode()
    }
    this._shouldChangeProps = true
  }

  getProp(key) {
    return (key in this.props) ? this.props[key] : ''
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

  replaceNode() {
    this._node = this.view()
    return this._node
  }

  /**
     *
     * --------------------------------------------------------------
     * Rendering
     * --------------------------------------------------------------
     */
  update() {
    this.view()
  }

  updateNode() {
    this._EnventHandler.dispatch(View.eventTypes()['UPDATE'], {})

    if (this._shouldUpdate) {
      this.update()
      this._EnventHandler.dispatch(View.eventTypes()['UPDATED'], {})
    }

    this._shouldUpdate = true
  }

  _render(parentNode) {
    DomRender(parentNode, this.node())
  }

  render(parentNode) {
    should(isNode(parentNode),
      'hotballoon:View:render require a Node argument'
    )

    this._EnventHandler.dispatch(View.eventTypes()['RENDER'], {})

    if (this._shouldRender) {
      this._render(parentNode)
      this._isRendered = true
      this._EnventHandler.dispatch(View.eventTypes()['RENDERED'], {})
    }

    this._shouldRender = true
  }
}

export {
  View
}
