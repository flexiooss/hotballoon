'use strict'
import {
  isNode,
  isFunction,
  isBoolean,
  camelCase,
  assert,
  MapOfArray
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
import {
  NodesHandlerMixin
} from './mixins/NodesHandlerMixin'
import {
  RequireIDMixin
} from './mixins/RequireIDMixin'
import {
  reconcile
} from 'flexio-nodes-reconciliation'

const EVENT_CALLBACK_PREFIX = 'on'

export const INIT = 'INIT'
export const UPDATE = 'UPDATE'
export const UPDATED = 'UPDATED'
export const RENDER = 'RENDER'
export const RENDERED = 'RENDERED'
export const MOUNT = 'MOUNT'
export const MOUNTED = 'MOUNTED'
export const PROPS_CHANGE = 'PROPS_CHANGE'
export const PROPS_CHANGED = 'PROPS_CHANGED'
export const STATE_CHANGE = 'STATE_CHANGE'
export const STATE_CHANGED = 'STATE_CHANGED'
export const STORE_CHANGED = 'STORE_CHANGED'

/**
 * @class
 * @description View describe a fragment of DOM
 * @extends ViewContainerContextMixin
 * @extends NodesHandlerMixin
 * @extends ViewContainerContextMixin
 * @extends PrivateStateMixin
 * @extends RequireIDMixin
 *
 */
class View extends NodesHandlerMixin(ViewContainerContextMixin(PrivateStateMixin(RequireIDMixin(class { })))) {
  /**
   * @constructor
   * @param {String} id
   * @param {ViewContainer} viewContainer
   * @param {Object} props
   */
  constructor(id, viewContainer, props = {}) {
    super()
    this.RequireIDMixinInit(id)
    this.ViewContainerContextMixinInit(viewContainer)
    this.PrivateStateMixinInit()
    this.NodesHandlerMixinInit(View)

    this.props = props

    var parentNode = null
    var _shouldInit = true
    var _shouldUpdate = true
    var _shouldRender = true
    var _shouldChangeProps = true
    var _shouldChangeState = true
    var _isRendered = false
    const _EventHandler = new EventHandler()
    const _tokenEvent = new MapOfArray()

    Object.defineProperties(this, {
      '__HB__CLASSNAME__': {
        configurable: false,
        writable: false,
        enumerable: true,
        value: '__HB__CLASSNAME__VIEW__'
      },
      parentNode: {
        configurable: false,
        enumerable: true,
        get: () => {
          return parentNode
        },
        set: (v) => {
          assert(!!isNode(v),
            'hotballoon:View:constructor: `parentNode` argument should be a NodeElement'
          )
          parentNode = v
        }
      },
      _shouldInit: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _shouldInit
        },
        set: (v) => {
          assert(!!isBoolean(v),
            'hotballoon:View:constructor: `_shouldInit` argument should be a boolean'
          )
          _shouldInit = v
        }
      },
      _shouldUpdate: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _shouldUpdate
        },
        set: (v) => {
          assert(!!isBoolean(v),
            'hotballoon:View:constructor: `_shouldUpdate` argument should be a boolean'
          )
          _shouldUpdate = v
        }
      },
      _shouldRender: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _shouldRender
        },
        set: (v) => {
          assert(!!isBoolean(v),
            'hotballoon:View:constructor: `_shouldRender` argument should be a boolean'
          )
          _shouldRender = v
        }
      },
      _shouldChangeProps: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _shouldChangeProps
        },
        set: (v) => {
          assert(!!isBoolean(v),
            'hotballoon:View:constructor: `_shouldChangeProps` argument should be a boolean'
          )
          _shouldChangeProps = v
        }
      },
      _shouldChangeState: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _shouldChangeState
        },
        set: (v) => {
          assert(!!isBoolean(v),
            'hotballoon:View:constructor: `_shouldChangeState` argument should be a boolean'
          )
          _shouldChangeState = v
        }
      },
      _isRendered: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _isRendered
        },
        set: (v) => {
          assert(!!isBoolean(v),
            'hotballoon:View:constructor: `_isRendered` argument should be a boolean'
          )
          _isRendered = v
        }
      },
      _EventHandler: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _EventHandler
        },
        set: (v) => {
          return false
        }
      },
      _tokenEvent: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _tokenEvent
        },
        set: (v) => {
          return false
        }
      }
    })

    this._initListeners()

    /**
     * @description dispatch new props to subViews in _subViewsNode property
     * @param {Object} payload
     * @param {String} type
     */
    this.onStoreChanged = (payload, type) => {
      this.setProps(payload)
    }
  }

  /**
   * Main method
   * @return {NodeType}
   */
  view() { }

  /*
   * --------------------------------------------------------------
   * EventHandler
   * --------------------------------------------------------------
   */

  /**
   *
   * @private
   * @description suscribe subView an event of this view
   * @param {String} key
   * @param {hotballoon/View} subView
   * @param {String} event : event name
   */
  _suscribeToEvent(key, subView, event = STORE_CHANGED) {
    let token = this._EventHandler.addEventListener(
      event,
      (payload, type) => {
        subView.dispatch(event, payload)
      },
      subView, 100)

    this._tokenEvent.add(key, token)
  }

  /**
   * @private
   * @description register all events for private listeners
   * Internal event property with callable value
   *
   * onInit
   * onUpdtate
   * onUpdtated
   * onRender
   * onRendered
   * onMount
   * onMounted
   * onPropsChange
   * onPropsChanged
   * onStateChange
   * onStateChanged
   * onStoreChanged
   *
   */
  _initListeners() {
    const types = {
      INIT,
      UPDATE,
      UPDATED,
      RENDER,
      RENDERED,
      MOUNT,
      MOUNTED,
      PROPS_CHANGE,
      PROPS_CHANGED,
      STATE_CHANGE,
      STATE_CHANGED,
      STORE_CHANGED
    }

    for (let eventType in types) {
      this._EventHandler.addEventListener(eventType, (payload, type) => {
        const propName = EVENT_CALLBACK_PREFIX + camelCase(type)

        if (this.hasOwnProperty(propName) && isFunction(this[propName])) {
          this[propName](payload)
        }
      })
    }
  }

  /**
   *
   * @param {String} event : event name
   * @param {Object} payload
   * @returns void
   */
  dispatch(event, payload) {
    this._EventHandler.dispatch(event, payload)
  }

  /**
   *
   * --------------------------------------------------------------
   * Prop & State
   * --------------------------------------------------------------
   */

  /**
   * @param {Object} props
   */
  setProps(props) {
    this.dispatch(PROPS_CHANGE, props)
    if (this._shouldChangeProps) {
      let oldProps = this.props
      this.props = props
      this.dispatch(PROPS_CHANGED, oldProps)
      this.updateNode()
    }
    this._shouldChangeProps = true
  }

  /**
   *
   * @param {String} key
   * @param {any} defaultValue
   * @returns any
   */
  getProp(key, defaultValue = '') {
    return (key in this.props) ? this.props[key] : defaultValue
  }

  /**
   * @private
   * @param {String} key
   * @param {any} val
   */
  _setPrivateStateProp(key, val) {
    this.dispatch(STATE_CHANGE, {
      key,
      val
    })
    if (this._shouldChangeState) {
      let oldStateProp = this._privateState.get(key)
      this._privateState.set(key, val)
      this.dispatch(STATE_CHANGED, {
        key,
        val: oldStateProp
      })
      this.updateNode()
    }
    this._shouldChangeState = true
  }

  /**
   *
   * @param {string} key
   * @param {any} defaultValue
   * @returns any
   */
  _getPrivateStateProp(key, defaultValue = undefined) {
    return (this._privateState.has(key)) ? this._privateState.get(key) : defaultValue
  }

  /**
   *
   * --------------------------------------------------------------
   * Rendering
   * --------------------------------------------------------------
   */

  /**
   * @private
   * @description update the node reference of this View
   */
  _update() {
    reconcile(this._node, this.view(), this.parentNode)
  }

  /**
   * @public
   */
  updateNode() {
    this._EventHandler.dispatch(UPDATE, {})

    if (this._shouldUpdate) {
      this._update()
      this._EventHandler.dispatch(UPDATED, {})
    }

    this._shouldUpdate = true
  }

  /**
   * @private
   */
  _render() {
    this._replaceNode()
    this._setNodeViewRef()
  }

  /**
   * @public
   */
  render() {
    this._EventHandler.dispatch(RENDER, {})

    if (this._shouldRender) {
      this._render()
      this._isRendered = true
      this._EventHandler.dispatch(RENDERED, {})
    }

    this._shouldRender = true
    return this.node()
  }

  /**
   * @private
   * @description mount `_node` property into `parentNode` argument
   */
  _mount() {
    this.parentNode.appendChild(this.node())
  }

  /**
   * @public
   * @description call _mount() with event hook
   * @see _mount()
   * @param {NodeElement} parentNode
   */
  mount(parentNode) {
    assert(isNode(parentNode),
      'hotballoon:View:render require a Node argument'
    )
    this.parentNode = parentNode

    this._EventHandler.dispatch(MOUNT, {})

    if (this._shouldRender) {
      this._mount()
      this._isRendered = true
      this._EventHandler.dispatch(MOUNTED, {})
    }

    this._shouldRender = true
  }

  /**
   * @public
   * @description Render the View() into `_node` property and mount this into the `parentNode` argument
   * @param {NodeElement} parentNode
   */
  renderAndMount(parentNode) {
    this.render()
    this.mount(parentNode)
  }
}

export {
  View
}
