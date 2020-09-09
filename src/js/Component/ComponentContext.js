import {WILL_REMOVE as VIEWCONTAINER_WILL_REMOVE} from '../View/ViewContainerPublicEventHandler'
import {assertType, isString, TypeCheck} from '@flexio-oss/js-commons-bundle/assert'
import {Sequence} from '@flexio-oss/js-commons-bundle/js-helpers'
import {StoreMap} from '../Store/StoreMap'
import {ViewContainerMap} from '../View/ViewContainerMap'
import {WithID} from '../abstract/WithID'
import {CLASS_TAG_NAME, CLASS_TAG_NAME_COMPONENT} from '../Types/HasTagClassNameInterface'
import {TypeCheck as HBTypeCheck} from '../Types/TypeCheck'

const __actionsToken = Symbol('__actionsToken')
const __sequenceId = Symbol('__sequenceId')
const __stores = Symbol('__stores')
const __viewContainers = Symbol('__viewContainers')
const __removing = Symbol('__removing')

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
   * @param {HotBalloonApplication} hotBalloonApplication
   */
  constructor(hotBalloonApplication) {
    HBTypeCheck.assertIsHotBalloonApplication(hotBalloonApplication)
    super(hotBalloonApplication.nextID())

    const _sequenceId = new Sequence(this.ID() + '_')
    const _stores = new StoreMap()
    const _viewContainers = new ViewContainerMap()
    let _removing = false
    /**
     * @type {Map<string, string>}
     * @private
     */
    const _actionsToken = new Map()

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
        [__sequenceId]: {
          configurable: false,
          enumerable: false,
          /**
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

        [__stores]: {
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

        [__viewContainers]: {
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
        [__actionsToken]: {
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
        },
        [__removing]: {
          configurable: false,
          enumerable: true,
          /**
           * @name ComponentContext#_actionsToken
           * @return {boolean}
           * @protected
           */
          get: () => {
            return _removing
          },
          /**
           * @param {boolean} v
           */
          set: (v) => {
            _removing = TypeCheck.assertIsBoolean(v)
          }
        }

      }
    )
  }

  /**
   * @param {HotBalloonApplication} hotballoonApplication
   * @return {ComponentContext}
   * @constructor
   * @static
   */
  static create(hotballoonApplication) {
    return new this(hotballoonApplication)
  }

  /**
   * @param {string} token
   * @param {ActionDispatcher} action
   * @return {string}
   */
  addActionToken(token, action) {
    this[__actionsToken].set(TypeCheck.assertIsString(token), action.ID())
    return token
  }

  /**
   * @param {string} token
   * @return {ComponentContext}
   */
  removeActionToken(token) {
    if (this[__actionsToken].has(TypeCheck.assertIsString(token))) {
      this.dispatcher().removeActionListener(this[__actionsToken].get(token), token)
      this[__actionsToken].delete(token)
    }
    return this
  }

  /**
   * @param {Store} store
   * @returns {Store} store
   */
  addStore(store) {
    if (this[__stores].has(store.ID()) && this[__stores].get(store.ID()) !== store) {
      throw new Error('Store already set : ' + store.ID())
    }
    this[__stores].set(store.ID(), store)
    store.setLogger(this.logger())
    return store
  }

  /**
   * @param {String}  tokenStore
   * @returns {StoreInterface} store
   */
  store(tokenStore) {
    return this[__stores].get(tokenStore)
  }

  /**
   * @param {ViewContainer} viewContainer
   * @returns {ViewContainer} viewContainer
   */
  addViewContainer(viewContainer) {
    if (this[__viewContainers].has(viewContainer.ID()) && this[__viewContainers].get(viewContainer.ID()) !== viewContainer) {
      throw new Error('ViewContainer already set : ' + viewContainer.ID())
    }
    this[__viewContainers].set(viewContainer.ID(), viewContainer)
    return viewContainer
  }

  /**
   * @param {String} tokenViewContainer
   * @returns {void}
   */
  removeViewContainerEntry(tokenViewContainer) {
    if (this[__viewContainers].has(tokenViewContainer)) {
      this.viewContainer(tokenViewContainer).dispatch(VIEWCONTAINER_WILL_REMOVE, {})
      this[__viewContainers].delete(tokenViewContainer)
    }
  }

  /**
   * @param {String} tokenViewContainer
   * @returns {void}
   */
  removeViewContainer(tokenViewContainer) {
    if (this[__viewContainers].has(tokenViewContainer)) {
      this.viewContainer(tokenViewContainer).dispatch(VIEWCONTAINER_WILL_REMOVE, {})
      this.viewContainer(tokenViewContainer).remove()
    }
  }

  /**
   * @param {String} key
   * @returns {?ViewContainer} viewContainer
   */
  viewContainer(key) {
    return this[__viewContainers].has(key) ? this[__viewContainers].get(key) : null
  }

  /**
   * @param {String} prefix
   * @returns {String}
   */
  nextID(prefix = '') {
    return prefix + this[__sequenceId].nextID()
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
   * @return {LoggerInterface}
   */
  logger() {
    return this.APP().logger()
  }

  remove() {
    this[__removing] = true
    for (let [token, value] of this[__actionsToken].entries()) {
      this.removeActionToken(token)
    }
    this[__actionsToken].clear()

    this[__stores].forEach(v => v.remove())
    this[__stores].clear()

    this[__viewContainers].forEach(v => v.remove())

    this.APP().removeComponentContext(this.ID())

    this.logger().log(
      this.logger().builder()
        .info()
        .pushLog('Remove : ' + this.ID())
        .pushLog(this),
      componentContextLogOptions
    )
  }

  /**
   * @return {boolean}
   */
  isRemoving() {
    return this[__removing]
  }
}
