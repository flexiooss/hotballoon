'use strict'
import {
  Action
} from './Action'
import {
  Store
} from './storeBases/Store'
import {
  ViewContainer,
  WILL_REMOVE as VIEWCONTAINER_WILL_REMOVE
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

/**
 * @class
 * @description The Component is the entry point of the module
 * @extends ApplicationContextMixin
 * @extends RequireIDMixin
 * @extends PrivateStateMixin
 *
 */
class Component extends ApplicationContextMixin(RequireIDMixin(PrivateStateMixin(class {}))) {
  constructor(hotBallonApplication, id) {
    super()

    /**
         * @description Mixinis init
         */
    this.ApplicationContextMixinInit(hotBallonApplication)
    this.RequireIDMixinInit(id)
    this.PrivateStateMixinInit()

    const _sequenceId = new Sequence(this._ID + '_')
    const dispatcherListenerTokens = new Map()
    const _actions = new MapOfInstance(Action)
    const actionsKey = new Map()
    const _stores = new MapOfInstance(Store)
    const storesKey = new Map()
    const _viewContainers = new MapOfInstance(ViewContainer)
    const viewContainersKey = new Map()

    Object.defineProperties(this, {
      _sequenceId: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _sequenceId
        },
        set: (v) => {
          return false
        }
      },
      dispatcherListenerTokens: {
        configurable: false,
        enumerable: true,
        get: () => {
          return dispatcherListenerTokens
        },
        set: (v) => {
          return false
        }
      },
      _actions: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _actions
        },
        set: (v) => {
          return false
        }
      },
      actionsKey: {
        configurable: false,
        enumerable: true,
        get: () => {
          return actionsKey
        },
        set: (v) => {
          return false
        }
      },
      _stores: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _stores
        },
        set: (v) => {
          return false
        }
      },
      storesKey: {
        configurable: false,
        enumerable: true,
        get: () => {
          return storesKey
        },
        set: (v) => {
          return false
        }
      },
      _viewContainers: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _viewContainers
        },
        set: (v) => {
          return false
        }
      },
      viewContainersKey: {
        configurable: false,
        enumerable: true,
        get: () => {
          return viewContainersKey
        },
        set: (v) => {
          return false
        }
      }
    })

    this._initActions()
    this._initStores()
    this._initDispatcherListeners()
    this._initViewContainers()
  }

  /**
     * @private
     * @description called by the constructor for int Actrions, Stores, Listeners, ViewContainers
     * @returns void
     *
     */
  _initActions() {}
  _initStores() {}
  _initDispatcherListeners() {}
  _initViewContainers() {}

  /**
     * @description called by the hotballoon Appliation before remove this Component
     */
  willRemove() {}

  /**
     * @param {String}  tokenAction
     * @param {hotballoon/Action}
     * @returns {void}
     */
  addAction(tokenAction, Action) {
    this._actions.add(tokenAction, Action)
  }

  /**
     *
     * @param {String} tokenAction
     * @param {hotballoon/Action} Action
     *
     */
  Action(tokenAction) {
    return this._actions.get(tokenAction)
  }

  /**
     * @param {String}  tokenStore
     * @param {hotballoon/Store}
     * @returns {void}
     */
  addStore(tokenStore, Store) {
    this._stores.add(tokenStore, Store)
  }

  /**
     *
     * @param {String}  tokenStore
     * @returns {hotballoon/Store} Store
     */
  Store(tokenStore) {
    return this._stores.get(tokenStore)
  }

  /**
     *
     * @param {String} tokenViewContainer
     * @param {hotballoon/ViewContainer} viewContainer
     * @returns {void}
     */
  addViewContainer(key, ViewContainer) {
    this._viewContainers.add(key, ViewContainer)
  }

  /**
     *
     * @param {String} tokenViewContainer
     * @returns {void}
     */
  removeViewContainer(tokenViewContainer) {
    if (this._viewContainers.has(tokenViewContainer)) {
      this.ViewContainer(tokenViewContainer).dispatch(VIEWCONTAINER_WILL_REMOVE, {})
      this._viewContainers.delete(tokenViewContainer)
    }
  }

  /**
     *
     * @param {String} tokenViewContainer
     * @returns {hotballoon/ViewContainer} ViewContainer
     */
  ViewContainer(tokenViewContainer) {
    return this._viewContainers.get(tokenViewContainer)
  }

  /**
     *
     * @param {String} prefix
     * @returns {String}
     */
  nextID(prefix = '') {
    return prefix + this._sequenceId.getNewId()
  }
}
export {
  Component
}
