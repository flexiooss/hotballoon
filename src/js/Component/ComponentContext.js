import {
  WILL_REMOVE as VIEWCONTAINER_WILL_REMOVE
} from '../View/ViewContainerPublicEventHandler'
import {assertType, isString} from '@flexio-oss/assert'
import {Sequence} from '@flexio-oss/js-helpers'
import {StoreMap} from '../Store/StoreMap'
import {ViewContainerMap} from '../View/ViewContainerMap'
import {WithID} from '../abstract/WithID'
import {
  CLASS_TAG_NAME,
  CLASS_TAG_NAME_COMPONENT
} from '../Types/HasTagClassNameInterface'
import {TypeCheck} from '../Types/TypeCheck'
import {ActionMap} from '../Action/ActionMap'

const _actionsToken = Symbol('_actionsToken')

const componentContextLogOptions = {
  color: 'green',
  titleSize: 2
}

/**
 * @extends WithID
 * @implements HasTagClassNameInterface
 */
export class ComponentContext extends WithID {
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

    const _sequenceId = new Sequence(this.ID + '_')
    const _stores = new StoreMap()
    const _viewContainers = new ViewContainerMap()
    const _actionsToken = new ActionMap()

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
         * @protected
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
           * @protected
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
           * @return {StoreMap}
           * @protected
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
           * @return {ViewContainerMap}
           * @protected
           */
          get: () => {
            return _viewContainers
          },
          set: (v) => {
            throw new Error('hotballoon:ComponentContext: : `_viewContainers` property already defined')
          }
        },
        [_actionsToken]: {
          configurable: false,
          enumerable: false,
          /**
           * @name ComponentContext#_actionsToken
           * @return {ActionMap}
           * @protected
           */
          get: () => {
            return _actionsToken
          },
          set: (v) => {
            throw new Error('hotballoon:ComponentContext: : `_actionsToken` property already defined')
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
   *
   * @param {string} token
   * @param {ActionDispatcher} action
   * @return {ComponentContext}
   */
  addActionToken(token, action) {
    assertType(
      isString(token),
      `${this.constructor.name}: 'token' should be string`
    )
    this[_actionsToken].add(token, action.ID)
    return this
  }

  /**
   *
   * @param {string} token
   * @return {ComponentContext}
   */
  removeActionToken(token) {
    assertType(
      isString(token),
      `${this.constructor.name}: 'token' should be string`
    )
    this[_actionsToken].delete(token)
    return this
  }

  /**
   * @param {Store} store
   * @returns {Store} store
   */
  addStore(store) {
    this._stores.set(store.ID, store)
    store.setLogger(this.logger())
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
    this._viewContainers.set(viewContainer.ID, viewContainer)
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
   * @returns {?ViewContainer} viewContainer
   */
  viewContainer(key) {
    return this._viewContainers.has(key) ? this._viewContainers.get(key) : null
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

  /**
   *
   * @return {LoggerInterface}
   */
  logger() {
    return this.APP().logger()
  }

  remove() {
    this[_actionsToken].forEach((v, k) => this.dispatcher().removeActionListener(k, v))
    this[_actionsToken].clear()

    this._stores.forEach(v => v.remove())
    this._stores.clear()
    this._viewContainers.forEach(v => v.remove())

    this.logger().log(
      this.logger().builder()
        .info()
        .pushLog('Remove : ' + this.ID)
        .pushLog(this),
      componentContextLogOptions
    )

  }
}
