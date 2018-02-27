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
const EVENT_STORE_CHANGED = 'StoreChanged'

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
         *
         */
    this._EnventHandler = new EventHandler()
    this._initListeners()
    this._tokenEvent = new MapOfArray()

    this._assertInit = true
    this._assertUpdate = true
    this._assertRender = true
    this._assertChangeProps = true
    this._assertChangeState = true

    /**
         * @description dispatch new props to subViews in _subViewsNode property
         * @param {Object} payload
         * @param {String} type
         */
    this.onStoreChanged = (payload, type) => {
      this.setProps(payload)
      this._dispatchStoreChanged(payload)
    }
  }

  view() {}
  registerListeners() {}

  /*
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
      MOUNT: 'MOUNT',
      MOUNTED: 'MOUNTED',
      PROPS_CHANGE: 'PROPS_CHANGE',
      PROPS_CHANGED: 'PROPS_CHANGED',
      STATE_CHANGE: 'STATE_CHANGE',
      STATE_CHANGED: 'STATE_CHANGED'
    }
    return (key) ? types[key] : types
  }

  _suscribeToEvent(part, key) {
    let token = this.subscribe(
      EVENT_STORE_CHANGED,
      (payload, type) => {
        part[EVENT_CALLBACK_PREFIX + EVENT_STORE_CHANGED](payload, type)
      },
      part, 100)

    this._tokenEvent.add(key, token)
  }

  _initListeners() {
    for (let eventType in View.eventTypes()) {
      this._EnventHandler.addEventListener(View.eventTypes(eventType), (payload, type) => {
        var propName = EVENT_CALLBACK_PREFIX + camelCase(type)

        if (this.hasOwnProperty(propName) && isFunction(this[propName])) {
          this[propName](payload)
        }
      })
    }
  }

  _dispatchStoreChanged(payload) {
    let countOfParts = this._subViews.length
    for (let i = 0; i < countOfParts; i++) {
      this._subViews[i].dispatch(EVENT_STORE_CHANGED, payload)
    }
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
    this._EnventHandler.dispatch(View.eventTypes('PROPS_CHANGE'), props)
    if (this._assertChangeProps) {
      this.props = props
      this._EnventHandler.dispatch(View.eventTypes('PROPS_CHANGED'), props)
      this.updateNode()
    }
    this._assertChangeProps = true
  }

  getProp(key) {
    return (key in this.props) ? this.props[key] : ''
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
    this._EnventHandler.dispatch(View.eventTypes('UPDATE'), {})

    if (this._assertUpdate) {
      // console.time('updateNode')

      this._update()
      // console.timeEnd('updateNode')

      this._EnventHandler.dispatch(View.eventTypes('UPDATED'), {})
    }

    this._assertUpdate = true
  }

  _render() {
    this._replaceNode()
    this._setNodeViewRef()
  }

  render() {
    this._EnventHandler.dispatch(View.eventTypes('RENDER'), {})

    if (this._assertRender) {
      this._render()
      this._isRendered = true
      this._EnventHandler.dispatch(View.eventTypes('RENDERED'), {})
    }

    this._assertRender = true
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

    this._EnventHandler.dispatch(View.eventTypes('MOUNT'), {})

    if (this._assertRender) {
      this._mount()
      this._isRendered = true
      this._EnventHandler.dispatch(View.eventTypes('MOUNTED'), {})
    }

    this._assertRender = true
  }

  renderAndMount(parentNode) {
    this.render()
    this.mount(parentNode)
  }
}

export {
  View
}
