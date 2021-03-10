import {WILL_REMOVE as VIEWCONTAINER_WILL_REMOVE} from '../View/ViewContainerPublicEventHandler'
import {assertType, isString, TypeCheck} from '@flexio-oss/js-commons-bundle/assert'
import {Sequence} from '@flexio-oss/js-commons-bundle/js-helpers'
import {StoreMap} from '../Store/StoreMap'
import {ViewContainerMap} from '../View/ViewContainerMap'
import {WithID} from '../abstract/WithID'
import {CLASS_TAG_NAME, CLASS_TAG_NAME_COMPONENT} from '../Types/HasTagClassNameInterface'
import {TypeCheck as HBTypeCheck} from '../Types/TypeCheck'
import {ListenedStoreMap} from '../Store/ListenedStoreMap'

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
   * @type {HotBalloonApplication}
   */
  #application
  /**
   * @type {Map<string, string>}
   */
  #actionsToken = new Map()
  /**
   * @type {Map<string, ListenedStore>}
   */
  #storesListened = new ListenedStoreMap()
  /**
   * @type {Sequence}
   */
  #sequenceForId = new Sequence(this.ID() + '_')
  /**
   * @type {StoreMap}
   */
  #stores = new StoreMap()
  /**
   * @type {ViewContainerMap}
   */
  #viewContainers = new ViewContainerMap()
  /**
   * @type {boolean}
   */
  #removed = false


  /**
   * @param {HotBalloonApplication} hotBalloonApplication
   */
  constructor(hotBalloonApplication) {
    HBTypeCheck.assertIsHotBalloonApplication(hotBalloonApplication)
    super(hotBalloonApplication.nextID())
    this.#application = hotBalloonApplication

    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_COMPONENT
    })
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
    this.#actionsToken.set(TypeCheck.assertIsString(token), action.ID())
    return token
  }

  /**
   * @param {string} token
   * @return {ComponentContext}
   */
  removeActionToken(token) {
    if (this.#actionsToken.has(TypeCheck.assertIsString(token))) {
      this.dispatcher().removeActionListener(this.#actionsToken.get(token), token)
      this.#actionsToken.delete(token)
    }
    return this
  }

  /**
   * @param {ListenedStore} listenedStore
   * @return {ComponentContext}
   */
  addListenedStore(listenedStore) {
    this.#storesListened.set(TypeCheck.assertIsString(listenedStore.token()), listenedStore)
    return this
  }

  /**
   * @param {String} token
   * @return {ComponentContext}
   */
  removeListenedStore(token) {
    if (this.#storesListened.has(token)) {
      this.#storesListened.get(token).remove()
      this.#storesListened.delete(token)
    }
    return this
  }

  /**
   * @param {Store} store
   * @returns {Store} store
   */
  addStore(store) {
    if (this.#stores.has(store.ID()) && this.#stores.get(store.ID()) !== store) {
      throw new Error('Store already set : ' + store.ID())
    }
    this.#stores.set(store.ID(), store)
    store.setLogger(this.logger())
    return store
  }

  /**
   * @param {String}  tokenStore
   * @returns {StoreInterface} store
   */
  store(tokenStore) {
    return this.#stores.get(tokenStore)
  }

  /**
   * @param {ViewContainer} viewContainer
   * @returns {ViewContainer} viewContainer
   */
  addViewContainer(viewContainer) {
    if (this.#viewContainers.has(viewContainer.ID()) && this.#viewContainers.get(viewContainer.ID()) !== viewContainer) {
      throw new Error('ViewContainer already set : ' + viewContainer.ID())
    }
    this.#viewContainers.set(viewContainer.ID(), viewContainer)
    return viewContainer
  }

  /**
   * @param {String} tokenViewContainer
   * @returns {void}
   */
  removeViewContainerEntry(tokenViewContainer) {
    if (this.#viewContainers.has(tokenViewContainer)) {
      this.viewContainer(tokenViewContainer).dispatch(VIEWCONTAINER_WILL_REMOVE, {})
      this.#viewContainers.delete(tokenViewContainer)
    }
  }

  /**
   * @param {String} tokenViewContainer
   * @returns {void}
   */
  removeViewContainer(tokenViewContainer) {
    if (this.#viewContainers.has(tokenViewContainer)) {
      this.viewContainer(tokenViewContainer).dispatch(VIEWCONTAINER_WILL_REMOVE, {})
      this.viewContainer(tokenViewContainer).remove()
    }
  }

  /**
   * @param {String} key
   * @returns {?ViewContainer}
   */
  viewContainer(key) {
    return this.#viewContainers.has(key) ? this.#viewContainers.get(key) : null
  }

  /**
   * @param {String} prefix
   * @returns {String}
   */
  nextID(prefix = '') {
    return prefix + this.#sequenceForId.nextID()
  }

  /**
   * @return {HotBalloonApplication}
   */
  APP() {
    return this.#application
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
    this.#removed = true
    for (let [token, value] of this.#actionsToken.entries()) {
      this.removeActionToken(token)
    }
    this.#actionsToken.clear()

    this.#storesListened.forEach(v => v.remove())
    this.#storesListened.clear()
    this.#stores.forEach(v => v.remove())
    this.#stores.clear()

    this.#viewContainers.forEach(v => v.remove())

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
    return this.#removed
  }
}
