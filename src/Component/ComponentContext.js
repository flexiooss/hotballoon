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
 * @description The componentContext is the entry point of the module
 * @extends WithIDBase
 * @implements HasTagClassNameInterface
 */
class ComponentContext extends WithIDBase {
  /**
   *
   * @param {HotBalloonApplication} hotBallonApplication
   */
  constructor(hotBallonApplication) {
    assert(testClassTagName(hotBallonApplication, CLASS_TAG_NAME_HOTBALLOON_APPLICATION),
      'hotballoon:componentContext:constructor:  hotBallonApplication argument should be an instance of ̀ hotballoon/HotBalloonApplication`, `%s` given',
      typeof hotBallonApplication
    )

    super(hotBallonApplication.nextID())

    this.debug.color = 'green'

    const _sequenceId = new Sequence(this.ID + '_')
    const _stores = new MapOfInstance(Store)
    const _viewContainers = new MapOfInstance(ViewContainer)

    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_COMPONENT
    })

    Object.defineProperties(this, {
      /**
         * @name ComponentContext#_APP
         * @type {HotBalloonApplication}
         */
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

      _viewContainers: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _viewContainers
        },
        set: (v) => {
          return false
        }
      }

    }
    )

    this[_init]()
  }

  /**
   *
   * @param {HotBalloonApplication} hotballoonApplication
   * @return {ComponentContext}
   * @constructor
   * @static
   */
  static create(hotballoonApplication) {
    return new this(hotballoonApplication)
  }

  /**
   * @description called by the hotballoon Application before remove this componentContext
   */
  willRemove() {
  }

  /**
   *
   * @param {EventListenerParam} eventListenerParam
   * @returns {String} token
   */
  listenAction(eventListenerParam) {
    return this.dispatcher().addActionListener(eventListenerParam)
  }

  /**
   * @param {Action} action
   */
  dispatchAction(action) {
    assert(action instanceof Action,
      'hotballoon:' + this.constructor.name + ':addAction: `action` argument should be an instance of Action'
    )
    action.dispatchWith(this.dispatcher())
  }

  /**
   * @param {store} store
   * @returns {String} tokenStore
   */
  addStore(store) {
    this._stores.add(store.ID, store)
    return store.ID
  }

  /**
   *
   * @param {String}  tokenStore
   * @returns {StoreInterface} store
   */
  store(tokenStore) {
    return this._stores.get(tokenStore)
  }

  /**
   *
   * @param {ViewContainer} viewContainer
   * @returns {ViewContainer} viewContainer
   */
  addViewContainer(viewContainer) {
    this._viewContainers.add(viewContainer.ID, viewContainer)
    return viewContainer
  }

  /**
   *
   * @param {String} tokenViewContainer
   * @returns {void}
   */
  removeViewContainer(tokenViewContainer) {
    if (this._viewContainers.has(tokenViewContainer)) {
      this.viewContainer(tokenViewContainer).dispatch(VIEWCONTAINER_WILL_REMOVE, {})
      this._viewContainers.delete(tokenViewContainer)
    }
  }

  /**
   *
   * @param {String} key
   * @returns {viewContainer} viewContainer
   */
  viewContainer(key) {
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
  dispatcher() {
    return this.APP().dispatcher()
  }

  /**
   * @return {service}
   */
  service(key) {
    return this.APP().service(key)
  }
}

export {
  ComponentContext
}
