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

/**
 * @class View
 * @extends ViewContainerContextMixin
 * @extends PrivateStateMixin
 * @description
 * @param {ViewContainer} viewContainer
 * @param {Object} props : properties from his registered Store
 *
 *
 */

class View extends NodesHandlerMixin(ViewContainerContextMixin(PrivateStateMixin(RequireIDMixin(class {})))) {
  constructor(id, viewContainer, props) {
    super()
    this.RequireIDMixinInit(id)
    this.ViewContainerContextMixinInit(viewContainer)
    this.PrivateStateMixinInit()
    this.NodesHandlerMixinInit(View)

    this.props = props || {}
    this.parentNode = null
    this._isRendered = false

    /**
         * @private
         * @prop EventHandler
         * @description Internal event property with callable value
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
    this._EventHandler = new EventHandler()
    this._initListeners()
    this._tokenEvent = new MapOfArray()

    var _shouldInit = true
    var _shouldUpdate = true
    var _shouldRender = true
    var _shouldChangeProps = true
    var _shouldChangeState = true

    Object.defineProperties(this, {
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
      }
    })

    /**
         * @description dispatch new props to subViews in _subViewsNode property
         * @param {Object} payload
         * @param {String} type
         */
    this.onStoreChanged = (payload, type) => {
      console.log(this.constructor.name)

      this.setProps(payload)
    }
  }

  /**
     * Main method
     * @return {NodeType}
     */
  view() {}

  /*
     * --------------------------------------------------------------
     * EventHandler
     * --------------------------------------------------------------
     */

  static eventType(key) {
    const types = {
      INIT: 'INIT',
      UPDATE: 'UPDATE',
      UPDATED: 'UPDATED',
      RENDER: 'RENDER',
      RENDERED: 'RENDERED',
      MOUNT: 'MOUNT',
      MOUNTED: 'MOUNTED',
      PROPS_CHANGE: 'PROPS_CHANGE',
      PROPS_CHANGED: 'PROPS_CHANGED',
      STATE_CHANGE: 'STATE_CHANGE',
      STATE_CHANGED: 'STATE_CHANGED',
      STORE_CHANGED: 'STORE_CHANGED'
    }
    return (key) ? types[key] : types
  }

  _suscribeToEvent(key, subView) {
    let token = this._EventHandler.addEventListener(
      View.eventType('STORE_CHANGED'),
      (payload, type) => {
        console.log(this.constructor.name)

        subView.dispatch(View.eventType('STORE_CHANGED'), payload)
      },
      subView, 100)

    this._tokenEvent.add(key, token)
  }

  _initListeners() {
    for (let eventType in View.eventType()) {
      this._EventHandler.addEventListener(View.eventType(eventType), (payload, type) => {
        const propName = EVENT_CALLBACK_PREFIX + camelCase(type)

        if (this.hasOwnProperty(propName) && isFunction(this[propName])) {
          this[propName](payload)
        }
      })
    }
  }
  dispatch(event, payload) {
    this._EventHandler.dispatch(event, payload)
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
    this.dispatch(View.eventType('PROPS_CHANGE'), props)
    if (this._shouldChangeProps) {
      let oldProps = this.props
      this.props = props
      this.dispatch(View.eventType('PROPS_CHANGED'), oldProps)
      this.updateNode()
    }
    this._shouldChangeProps = true
  }

  getProp(key, defaultValue = '') {
    return (key in this.props) ? this.props[key] : defaultValue
  }

  _setPrivateStateProp(key, val) {
    this.dispatch(View.eventType('STATE_CHANGE'), {
      key,
      val
    })
    if (this._shouldChangeState) {
      let oldStateProp = this._privateState.get(key)
      this._privateState.set(key, val)
      this.dispatch(View.eventType('STATE_CHANGED'), {
        key,
        val: oldStateProp
      })
      this.updateNode()
    }
    this._shouldChangeState = true
  }

  _getPrivateStateProp(key, defaultValue = undefined) {
    return (this._privateState.has(key)) ? this._privateState.get(key) : defaultValue
  }

  /**
     *
     * --------------------------------------------------------------
     * Rendering
     * --------------------------------------------------------------
     */

  _update() {
    reconcile(this._node, this.view(), this.parentNode)
  }

  updateNode() {
    this._EventHandler.dispatch(View.eventType('UPDATE'), {})

    if (this._shouldUpdate) {
      this._update()
      this._EventHandler.dispatch(View.eventType('UPDATED'), {})
    }

    this._shouldUpdate = true
  }

  _render() {
    this._replaceNode()
    this._setNodeViewRef()
  }

  render() {
    this._EventHandler.dispatch(View.eventType('RENDER'), {})

    if (this._shouldRender) {
      this._render()
      this._isRendered = true
      this._EventHandler.dispatch(View.eventType('RENDERED'), {})
    }

    this._shouldRender = true
    return this.node()
  }

  _mount() {
    this.parentNode.appendChild(this.node())
  }

  mount(parentNode) {
    assert(isNode(parentNode),
      'hotballoon:View:render require a Node argument'
    )
    this.parentNode = parentNode

    this._EventHandler.dispatch(View.eventType('MOUNT'), {})

    if (this._shouldRender) {
      this._mount()
      this._isRendered = true
      this._EventHandler.dispatch(View.eventType('MOUNTED'), {})
    }

    this._shouldRender = true
  }

  renderAndMount(parentNode) {
    this.render()
    this.mount(parentNode)
  }
}

export {
  View
}
