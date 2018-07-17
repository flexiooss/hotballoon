'use strict'
import {
  Action
} from './Action'
import {
  Store
} from './Store/Store'
import {
  ViewContainer,
  WILL_REMOVE as VIEWCONTAINER_WILL_REMOVE
} from './View/ViewContainer'
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
import {Debugable} from './bases/Debugable'
import {CLASS_TAG_NAME} from './CLASS_TAG_NAME'

export const CLASS_TAG_NAME_COMPONENT = Symbol('__HB__COMPONENT__')

/**
 * @class
 * @description The Component is the entry point of the module
 * @extends ApplicationContextMixin
 * @extends RequireIDMixin
 * @extends PrivateStateMixin
 * @extends Debugable
 *
 */
class Component extends ApplicationContextMixin(RequireIDMixin(PrivateStateMixin(Debugable))) {
  constructor(hotBallonApplication) {
    super()
    this.debug.color = 'green'

    /**
     * @description Mixinis init
     */
    this.ApplicationContextMixinInit(hotBallonApplication)
    this.RequireIDMixinInit(hotBallonApplication.nextID())
    this.PrivateStateMixinInit()

    const _sequenceId = new Sequence(this._ID + '_')
    const dispatcherListenerTokens = new Map()
    const _actions = new MapOfInstance(Action)
    const actionsKey = new Map()
    const _stores = new MapOfInstance(Store)
    const storesKeyRegister = new Map()
    const _viewContainers = new MapOfInstance(ViewContainer)
    const viewContainersKey = new Map()

    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_COMPONENT
    })

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
      storesKeyRegister: {
        configurable: false,
        enumerable: true,
        get: () => {
          return storesKeyRegister
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

    this._init()
  }

  /**
   * @private
   * @returns void
   */
  _init() {
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
  _initActions() { }
  _initStores() { }
  _initDispatcherListeners() { }
  _initViewContainers() { }

  /**
   * @description called by the hotballoon Appliation before remove this Component
   */
  willRemove() { }

  /**
   *
   * @param {String} type : action type
   * @param {Function} callback
   * @returns {String} token
   */
  addActionListener(type, callback) {
    return this.Dispatcher().addActionListener(type, callback)
  }

  /**
   * @param {String}  tokenAction
   * @param {hotballoon/Action}
   * @returns {String} tokenAction
   */
  addAction(tokenAction, Action) {
    this._actions.add(tokenAction, Action)
    return tokenAction
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
   * @param {hotballoon/Store}
   * @returns {String} tokenStore
   */
  addStore(store) {
    this._stores.add(store._ID, store)
    return store._ID
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
   * @param {string} key token registered into storesKeyRegister
   * @return {Store} Store
   */
  StoreByRegister(key) {
    return this.Store(this.storesKeyRegister.get(key))
  }
  /**
   *
   * @param {string} key token registered into storesKeyRegister
   * @returns {mixed} data of Store
   */
  StoreDataByRegister(key) {
    return this.StoreByRegister(key).data()
  }

  /**
   *
   * @param {hotballoon/ViewContainer} viewContainer
   * @returns {hotballoon/ViewContainer} ViewContainer
   */
  addViewContainer(ViewContainer) {
    this._viewContainers.add(ViewContainer._ID, ViewContainer)
    return ViewContainer
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
   * @param {String} key
   * @returns {hotballoon/ViewContainer} ViewContainer
   */
  ViewContainer(key) {
    return this._viewContainers.get(key)
  }

  /**
   *
   * @param {String} prefix
   * @returns {String}
   */
  nextID(prefix = '') {
    return prefix + this._sequenceId.nextID()
  }
}
export {
  Component
}
