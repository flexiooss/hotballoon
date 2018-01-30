import {
  MapOfInstance
} from './mapExtended/MapOfInstance'
import {
  MapOfArray
} from './mapExtended/MapOfArray'
import {
  Action
} from './Action'
import {
  StoreBase
} from './bases/StoreBase'
import {
  ViewContainer
} from './ViewContainer'

import {
  Sequence
} from './helpers/Sequence'
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

    this._dispatchToken = {}
    this._dispatchToken = new MapOfArray()

    this._viewContainers = new MapOfInstance(ViewContainer)
    this._stores = new MapOfInstance(StoreBase)
    this._actions = new MapOfInstance(Action)

    this._initActions()
    this._initStores()
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
  addViewContainer(ViewContainerConstructor, ...args) {
    let key = 'viewContainer_' + this._sequenceId.getNewId()
    return this._viewContainers.add(key, new ViewContainerConstructor(this, key, ...args))
  }
  viewContainer(key) {
    return this._viewContainers.get(key)
  }
}
export {
  Component
}
