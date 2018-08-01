'use strict'
import {Action} from '../Action/Action'
import {Store} from '../Store/Store'
import {
  ViewContainer,
  WILL_REMOVE as VIEWCONTAINER_WILL_REMOVE
} from '../View/ViewContainer'
import {MapOfInstance, Sequence, assert} from 'flexio-jshelpers'
import {WithIDBase} from '../bases/WithIDBase'
import {
  CLASS_TAG_NAME,
  CLASS_TAG_NAME_COMPONENT,
  CLASS_TAG_NAME_HOTBALLOON_APPLICATION,
  testClassTagName
} from '../HasTagClassNameInterface'

const _init = Symbol('_init')

/**
 * @class
 * @description The Component is the entry point of the module
 * @extends WithIDBase
 * @implements HasTagClassNameInterface
 */
class Component extends WithIDBase {
  constructor(hotBallonApplication) {
    assert(testClassTagName(hotBallonApplication, CLASS_TAG_NAME_HOTBALLOON_APPLICATION),
      'hotballoon:Component:constructor:  hotBallonApplication argument should be an instance of ̀ hotballoon/HotBalloonApplication`, `%s` given',
      typeof hotBallonApplication
    )
    super(hotBallonApplication.nextID())

    this.debug.color = 'green'

    const _sequenceId = new Sequence(this.ID + '_')
    const actionsListenerTokens = new Map()
    const _stores = new MapOfInstance(Store)
    const storesKeyRegister = new Map()
    const _viewContainers = new MapOfInstance(ViewContainer)
    const viewContainersKey = new Map()
    const _privateState = new Map()

    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_COMPONENT
    })

    Object.defineProperties(this, {
      _APP: {
        configurable: false,
        enumerable: false,
        get: () => {
          return hotBallonApplication
        },
        set: (v) => {
          assert(false,
            `hotballoon:${this.constructor.name}: _APP property already defined`
          )
          return false
        }
      },
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
      actionsListenerTokens: {
        configurable: false,
        enumerable: true,
        get: () => {
          return actionsListenerTokens
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
      },
      _privateState: {
        configurable: false,
        enumerable: false,
        value: _privateState
      }
    }
    )

    this[_init]()
  }

  /**
   *
   * @param {HotballoonApplication} hotballoonApplication
   * @return {Component}
   * @constructor
   * @static
   */
  static create(hotballoonApplication) {
    return new this(hotballoonApplication)
  }

  /**
   * @private
   * @returns void
   */
  [_init]() {
    this._initStores()
    this._initDispatcherListeners()
    this._initViewContainers()
  }

  /**
   * @protected
   * @description called by the constructor for int Actrions, Stores, Listeners, ViewContainers
   * @returns void
   *
   */
  _initStores() {
  }

  _initDispatcherListeners() {
  }

  _initViewContainers() {
  }

  /**
   * @description called by the hotballoon Appliation before remove this Component
   */
  willRemove() {
  }

  /**
   * @private
   * @param {String} key
   * @param {mixed}
   */
  _setState(key, value) {
    this._privateState.set(key, value)
  }

  /**
   * @private
   * @param {String} key
   * @returns {mixed}
   */
  _state(key) {
    return this._privateState.get(key)
  }

  /**
   * @private
   * @param {String} key
   */
  _delete(key) {
    this._privateState.delete(key)
  }

  /**
   *
   * @param {EventListenerParam} eventListenerParam
   * @returns {String} token
   */
  listenAction(eventListenerParam) {
    return this.Dispatcher().addActionListener(eventListenerParam)
  }

  /**
   * @param {Action} action
   */
  dispatchAction(action) {
    assert(action instanceof Action,
      'hotballoon:' + this.constructor.name + ':addAction: `action` argument should be an instance of Action'
    )
    action.dispatchWith(this.Dispatcher())
  }

  /**
   * @param {hotballoon/Store}
   * @returns {String} tokenStore
   */
  addStore(store) {
    this._stores.add(store.ID, store)
    return store.ID
  }

  /**
   *
   * @param {String}  tokenStore
   * @returns {StoreInterface} Store
   */
  Store(tokenStore) {
    return this._stores.get(tokenStore)
  }

  /**
   *
   * @param {string} key token registered into storesKeyRegister
   * @return {StoreInterface} Store
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
    this._viewContainers.add(ViewContainer.ID, ViewContainer)
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

  /**
   * @return {HotBalloonApplication}
   */
  APP() {
    return this._APP
  }

  /**
   * @return {Dispatcher}
   */
  Dispatcher() {
    return this.APP().Dispatcher()
  }

  /**
   * @return {Service}
   */
  Service(key) {
    return this.APP().Service(key)
  }
}

export {
  Component
}
