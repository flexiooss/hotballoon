import {
  Action
} from './Action'
import {
  Store
} from './storeBases/Store'
import {
  ViewContainer
} from './ViewContainer'
import {
  MapOfInstance,
  Sequence
} from 'flexio-jshelpers'
import {
  RequireIDMixin
} from './mixins/RequireIDMixin'
import {
  ApplicationContextMixin
} from './mixins/ApplicationContextMixin'
import {
  PrivateStateMixin
} from './mixins/PrivateStateMixin'

class Component extends ApplicationContextMixin(RequireIDMixin(PrivateStateMixin(class {}))) {
  constructor(hotBallonApplication, id) {
    super()
    this.ApplicationContextMixinInit(hotBallonApplication)
    this.RequireIDMixinInit(id)
    this.PrivateStateMixinInit()

    this._sequenceId = new Sequence(this._ID + '_')

    this.dispatcherListenerTokens = new Map()
    this._viewContainers = new MapOfInstance(ViewContainer)
    this.viewContainersKey = new Map()
    this._stores = new MapOfInstance(Store)
    this.storesKey = new Map()
    this._actions = new MapOfInstance(Action)
    this.actionssKey = new Map()

    this._initActions()
    this._initStores()
    this._initDispatcherListeners()
    this._initViewContainers()
  }

  /**
     *
     * --------------------------------------------------------------
     * Init
     * --------------------------------------------------------------
     */

  _initActions() {}
  _initStores() {}
  _initViewContainers() {}
  /**
     *
     * --------------------------------------------------------------
     * Remove by Application
     * --------------------------------------------------------------
     */

  willRemove() {}

  /**
     *
     * --------------------------------------------------------------
     * Actions
     * --------------------------------------------------------------
     */
  addAction(key, action) {
    this._actions.add(key, action)
  }
  Action(key) {
    return this._actions.get(key)
  }
  /**
     *
     * --------------------------------------------------------------
     * Stores
     * --------------------------------------------------------------
     */
  addStore(StoreConstructor, ...args) {
    let key = 'store_' + this._sequenceId.getNewId()
    return this._stores.add(key, new StoreConstructor(key, ...args))
  }
  Store(key) {
    return this._stores.get(key)
  }
  /**
     *
     * --------------------------------------------------------------
     * ViewContainers
     * --------------------------------------------------------------
     */
  addViewContainer(ViewContainerConstructor, storesMap, ...args) {
    let key = 'viewContainer_' + this._sequenceId.getNewId()
    return this._viewContainers.add(key, new ViewContainerConstructor(this, key, storesMap, ...args))
  }
  removeViewContainer(viewContainerID) {
    if (this._viewContainers.has(viewContainerID)) {
      this.ViewContainer(viewContainerID).dispatch(ViewContainer.eventTypes('WILL_REMOVE'), {})
      this._viewContainers.delete(viewContainerID)
    }
  }
  ViewContainer(key) {
    return this._viewContainers.get(key)
  }
}
export {
  Component
}
