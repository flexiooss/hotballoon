import {assertInstanceOf, assertType, isString, TypeCheck} from '@flexio-oss/js-commons-bundle/assert'
import {Sequence} from '@flexio-oss/js-commons-bundle/js-helpers'
import {WithID} from '../abstract/WithID'
import {CLASS_TAG_NAME, CLASS_TAG_NAME_COMPONENT} from '../Types/HasTagClassNameInterface'
import {TypeCheck as HBTypeCheck} from '../Types/TypeCheck'
import {ActionsHandler} from '../Action/ActionsHandler'
import {StoresHandler} from '../Store/StoresHandler'
import {ViewContainersHandler} from '../View/ViewContainersHandler'

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
   * @type {Sequence}
   */
  #sequenceForId = new Sequence(this.ID() + '_')
  /**
   * @type {boolean}
   */
  #removed = false
  /**
   * @type {ActionsHandler}
   */
  #actionsHandler
  /**
   * @type {StoresHandler}
   */
  #storesHandler
  /**
   * @type {ViewContainersHandler}
   */
  #viewContainersHandler


  /**
   * @param {HotBalloonApplication} hotBalloonApplication
   * @param {string} id
   * @param {ActionsHandler} actionsHandler
   * @param {StoresHandler} storesHandler
   * @param {ViewContainersHandler} viewContainersHandler
   */
  constructor(hotBalloonApplication, id, actionsHandler, storesHandler, viewContainersHandler) {
    HBTypeCheck.assertIsHotBalloonApplication(hotBalloonApplication)

    super(id)
    this.#application = hotBalloonApplication
    this.#actionsHandler = assertInstanceOf(actionsHandler, ActionsHandler, 'ActionsHandler')
    this.#storesHandler = assertInstanceOf(storesHandler, StoresHandler, 'StoresHandler')
    this.#viewContainersHandler = assertInstanceOf(viewContainersHandler, ViewContainersHandler, 'ViewContainersHandler')

    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_COMPONENT
    })
  }

  /**
   * @return {ActionsHandler}
   */
  actions() {
    return this.#actionsHandler
  }

  /**
   * @return {StoresHandler}
   */
  stores() {
    return this.#storesHandler
  }

  /**
   * @return {ViewContainersHandler}
   */
  viewContainers() {
    return this.#viewContainersHandler
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
    this.#actionsHandler.remove()
    this.#storesHandler.remove()
    this.#viewContainersHandler.remove()
    this.APP().components().detach(this)

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
