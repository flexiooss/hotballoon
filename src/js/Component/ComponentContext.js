import {assertInstanceOf, assertType, isString, TypeCheck} from '@flexio-oss/js-commons-bundle/assert'
import {Sequence} from '@flexio-oss/js-commons-bundle/js-helpers'
import {WithID} from '../abstract/WithID'
import {CLASS_TAG_NAME, CLASS_TAG_NAME_COMPONENT} from '../Types/HasTagClassNameInterface'
import {TypeCheck as HBTypeCheck} from '../Types/TypeCheck'
import {ActionsHandler} from '../Action/ActionsHandler'
import {StoresHandler} from '../Store/StoresHandler'
import {ViewContainersHandler} from '../View/ViewContainersHandler'
import {OrderedEventHandler} from '../Event/OrderedEventHandler'
import {OrderedEventListenerConfigBuilder} from '@flexio-oss/js-commons-bundle/event-handler'
import {Logger} from "@flexio-oss/js-commons-bundle/hot-log";

const REMOVE = 'REMOVE'

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
   * @type {OrderedEventHandler}
   */
  #eventHandler = new OrderedEventHandler()
  /**
   * @type {Logger}
   */
  #logger = Logger.getLogger(this.constructor.name, 'HotBalloon.ComponentContext')

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
   * @return {SchedulerHandler}
   */
  scheduler() {
    return this.APP().scheduler()
  }

  /**
   * @param {function} clb
   * @return {EventHandler}
   */
  onRemove(clb){
    return new EventHandler(this.#eventHandler.on( OrderedEventListenerConfigBuilder.listen(REMOVE).callback(clb).build()), this)
  }

  /**
   * @param {string} token
   * @return {ComponentContext}
   */
  unregisterEvent(token){
    this.#eventHandler.removeEventListener(token)
    return this
  }

  remove() {
    this.#removed = true
    this.#actionsHandler.remove()
    this.#storesHandler.remove()
    this.#viewContainersHandler.remove()
    this.APP().components().detach(this)

    this.#eventHandler.dispatch(REMOVE, null)

    this.#logger.info('Remove : ' + this.ID())
  }

  /**
   * @return {boolean}
   */
  isRemoving() {
    return this.#removed
  }
}


class EventHandler{
  /**
   * {string}
   */
  #token
  /**
   * {ComponentContext}
   */
  #componentContext

  /**
    * @param {string} token
   * @param {ComponentContext} componentContext
   */
  constructor(token, componentContext) {
    this.#token = TypeCheck.assertIsString(token)
    this.#componentContext = assertInstanceOf(componentContext,ComponentContext,'ComponentContext')
  }

  remove(){
    this.#componentContext.unregisterEvent(this.#token)
  }
}
