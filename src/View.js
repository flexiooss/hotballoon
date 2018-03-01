import {
  isNode,
  isFunction,
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
// const EVENT_STORE_CHANGED = 'StoreChanged'

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
    this._EnventHandler = new EventHandler()
    this._initListeners()
    this._tokenEvent = new MapOfArray()

    this._shouldInit = true
    this._shouldUpdate = true
    this._shouldRender = true
    this._shouldChangeProps = true
    this._shouldChangeState = true

    /**
         * @description dispatch new props to subViews in _subViewsNode property
         * @param {Object} payload
         * @param {String} type
         */
    this.onStoreChanged = (payload, type) => {
      this.setProps(payload)
    }
  }

  view() {}
  registerListeners() {}

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
    let token = this._EnventHandler.addEventListener(
      // EVENT_STORE_CHANGED,
      View.eventType('PROPS_CHANGED'),
      (payload, type) => {
        // window.alert()
        // subView[EVENT_CALLBACK_PREFIX + EVENT_STORE_CHANGED](payload, type)
        subView.dispatch(View.eventType('STORE_CHANGED'), payload)
      },
      subView, 100)

    this._tokenEvent.add(key, token)
  }

  _initListeners() {
    for (let eventType in View.eventType()) {
      this._EnventHandler.addEventListener(View.eventType(eventType), (payload, type) => {
        var propName = EVENT_CALLBACK_PREFIX + camelCase(type)

        if (this.hasOwnProperty(propName) && isFunction(this[propName])) {
          this[propName](payload)
        }
      })
    }
  }
  dispatch(event, payload) {
    this._EnventHandler.dispatch(event, payload)
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
      this.props = props
      this.dispatch(View.eventType('PROPS_CHANGED'), props)
      this.updateNode()
    }
    this._shouldChangeProps = true
  }

  getProp(key, defaultValue = '') {
    return (key in this.props) ? this.props[key] : defaultValue
  }

  _setPrivateStateProp(key, val) {
    this.dispatch(View.eventType('STATE_CHANGE'), {})
    if (this._shouldChangeState) {
      this._privateState.set(key, val)
      this.dispatch(View.eventType('STATE_CHANGED'), {})
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
    this._EnventHandler.dispatch(View.eventType('UPDATE'), {})

    if (this._shouldUpdate) {
      this._update()
      this._EnventHandler.dispatch(View.eventType('UPDATED'), {})
    }

    this._shouldUpdate = true
  }

  _render() {
    this._replaceNode()
    this._setNodeViewRef()
  }

  render() {
    this._EnventHandler.dispatch(View.eventType('RENDER'), {})

    if (this._shouldRender) {
      this._render()
      this._isRendered = true
      this._EnventHandler.dispatch(View.eventType('RENDERED'), {})
    }

    this._shouldRender = true
    // console.dir(this.node())
    // console.dir(this)
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

    this._EnventHandler.dispatch(View.eventType('MOUNT'), {})

    if (this._shouldRender) {
      this._mount()
      this._isRendered = true
      this._EnventHandler.dispatch(View.eventType('MOUNTED'), {})
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
