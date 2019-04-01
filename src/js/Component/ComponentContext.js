'use strict'
import {Store} from '../Store/Store'
import {
  ViewContainer
} from '../View/ViewContainer'
import {
  WILL_REMOVE as VIEWCONTAINER_WILL_REMOVE
} from '../View/ViewContainerPublicEventHandler'
import {MapOfInstance, Sequence, assertType} from 'flexio-jshelpers'
import {WithIDBase} from '../bases/WithIDBase'
import {
  CLASS_TAG_NAME,
  CLASS_TAG_NAME_COMPONENT
} from '../HasTagClassNameInterface'
import {TypeCheck} from '../TypeCheck'

/**
 * @class
 * @description The componentContext is the entry point of the module
 * @extends WithIDBase
 * @implements HasTagClassNameInterface
 */
export class ComponentContext extends WithIDBase {
  /**
   *
   * @param {HotBalloonApplication} hotBalloonApplication
   */
  constructor(hotBalloonApplication) {
    assertType(TypeCheck.isHotballoonApplication(hotBalloonApplication),
      'hotballoon:componentContext:constructor:  `hotBalloonApplication` argument should be an instance of ̀ hotballoon/HotBalloonApplication`, `%s` given',
      typeof hotBalloonApplication
    )

    super(hotBalloonApplication.nextID())

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
         * @params {HotBalloonApplication}
         */
      _APP: {
        configurable: false,
        enumerable: false,
        get: () => {
          return hotBalloonApplication
        },
        set: (v) => {
          throw new Error('hotballoon:ComponentContext: : `_APP` property already defined')
        }
      },
      _sequenceId: {
        configurable: false,
        enumerable: false,
        /**
           *
           * @name ComponentContext#_sequenceId
           * @return {Sequence}
           */
        get: () => {
          return _sequenceId
        },
        set: (v) => {
          throw new Error('hotballoon:ComponentContext: : `_sequenceId` property already defined')
        }
      },

      _stores: {
        configurable: false,
        enumerable: false,
        /**
           * @name ComponentContext#_stores
           * @return {MapOfInstance}
           */
        get: () => {
          return _stores
        },
        set: (v) => {
          throw new Error('hotballoon:ComponentContext: : `_stores` property already defined')
        }
      },

      _viewContainers: {
        configurable: false,
        enumerable: false,
        /**
           * @name ComponentContext#_viewContainers
           * @return {MapOfInstance}
           */
        get: () => {
          return _viewContainers
        },
        set: (v) => {
          throw new Error('hotballoon:ComponentContext: : `_viewContainers` property already defined')
        }
      }

    }
    )
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
   * @param {Store} store
   * @returns {Store} store
   */
  addStore(store) {
    this._stores.add(store.ID, store)
    return store
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
