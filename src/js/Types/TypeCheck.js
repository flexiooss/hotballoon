import {
  CLASS_TAG_NAME_ACTION_DISPATCHER,
  CLASS_TAG_NAME_COMPONENT,
  CLASS_TAG_NAME_DISPATCHER,
  CLASS_TAG_NAME_EXECUTOR,
  CLASS_TAG_NAME_HOTBALLOON_APPLICATION,
  CLASS_TAG_NAME_JOB,
  CLASS_TAG_NAME_PROXYSTORE,
  CLASS_TAG_NAME_PUBLIC_STORE_HANDLER,
  CLASS_TAG_NAME_STORE,
  CLASS_TAG_NAME_VIEW,
  CLASS_TAG_NAME_VIEWCONTAINER,
  CLASS_TAG_NAME_ACTION_SUBSCRIBER,
  testClassTagName
} from './HasTagClassNameInterface.js'
import {assertType, isNull} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {ElementDescription} from '../HotballoonNodeElement/ElementDescription.js'
import {RemovedException} from "../Exception/RemovedException.js";


class TypeCheck {
  /**
   * @param {Object} inst
   * @return {boolean}
   */
  static isHotballoonApplication(inst) {
    return testClassTagName(inst, CLASS_TAG_NAME_HOTBALLOON_APPLICATION)
  }

  /**
   * @param {HotBalloonApplication} inst
   * @return {HotBalloonApplication}
   * @throws {TypeError}
   */
  static assertIsHotBalloonApplication(inst) {
    assertType(TypeCheck.isHotballoonApplication(inst),      '`inst` should be an HotballoonApplication')
    return inst
  }

  /**
   * @param {Dispatcher} inst
   * @return {boolean}
   */
  static isDispatcher(inst) {
    return testClassTagName(inst, CLASS_TAG_NAME_DISPATCHER)
  }

  /**
   * @param {Dispatcher} inst
   * @return {Dispatcher}
   * @throws {TypeError}
   */
  static assertIsDispatcher(inst) {
    assertType(TypeCheck.isDispatcher(inst), '`inst` should be a `Dispatcher`')
    return inst
  }

  /**
   * @param {Object} inst
   * @return {boolean}
   */
  static isComponentContext(inst) {
    return testClassTagName(inst, CLASS_TAG_NAME_COMPONENT)
  }

  /**
   * @param {ComponentContext} inst
   * @return {ComponentContext}
   * @throws {TypeError}
   */
  static assertIsComponentContext(inst) {
    assertType(TypeCheck.isComponentContext(inst),
      '`inst` should be an ComponentContext'
    )
    return inst
  }

  /**
   * @param {Object} inst
   * @return {boolean}
   */
  static isActionDispatcher(inst) {
    return testClassTagName(inst, CLASS_TAG_NAME_ACTION_DISPATCHER)
  }

  /**
   * @param {ActionDispatcher} inst
   * @param {Class} typeOf
   * @param {?string} stringName
   * @return {ActionDispatcher}
   * @throws {TypeError}
   */
  static assertIsActionDispatcher(inst, typeOf = null, stringName = null) {
    assertType(TypeCheck.isActionDispatcher(inst),
      'TypeCheck:assertIsActionDispatcher: `inst` argument should be an ActionDispatcher'
    )
    if (!isNull(typeOf)) {
      assertType(inst.isTypeOf(typeOf),
        `TypeCheck:assertIsActionDispatcher: \`inst\` argument should be a ${!isNull(stringName) ? stringName : typeOf.constructor.name}`
      )
    }
    return inst
  }

  /**
   * @param {Object} inst
   * @return {boolean}
   */
  static isActionSubscriber(inst) {
    return testClassTagName(inst, CLASS_TAG_NAME_ACTION_SUBSCRIBER) || TypeCheck.isActionDispatcher(inst)
  }

  /**
   * @param {ActionSubscriber} inst
   * @return {ActionSubscriber}
   * @throws {TypeError}
   */
  static assertIsActionSubscriber(inst) {
    assertType(TypeCheck.isActionSubscriber(inst),
      'TypeCheck:assertIsActionDispatcher: `inst` argument should be an ActionSubscriber'
    )
    return inst
  }

  /**
   * @param {Store} inst
   * @return {boolean}
   */
  static isStore(inst) {
    return testClassTagName(inst, CLASS_TAG_NAME_STORE)
  }

  /**
   * @param {Store} inst
   * @return {Store}
   * @throws {TypeError}
   */
  static assertIsStore(inst) {
    assertType(TypeCheck.isStore(inst), '`inst` should be `Store`')
    return inst
  }

  /**
   * @param {Object} inst
   * @return {boolean}
   */
  static isProxyStore(inst) {
    return testClassTagName(inst, CLASS_TAG_NAME_PROXYSTORE)
  }

  /**
   * @param {ProxyStore} inst
   * @return {ProxyStore}
   * @throws {TypeError}
   */
  static assertIsProxyStore(inst) {
    assertType(TypeCheck.isProxyStore(inst), '`inst` should be `ProxyStore`')
    return inst
  }

  /**
   * @param {PublicStoreHandler} inst
   * @return {boolean}
   */
  static isPublicStoreHandler(inst) {
    return testClassTagName(inst, CLASS_TAG_NAME_PUBLIC_STORE_HANDLER)
  }

  /**
   * @param {PublicStoreHandler} inst
   * @return {PublicStoreHandler}
   */
  static assertIsPublicStoreHandler(inst) {
    assertType(TypeCheck.isPublicStoreHandler(inst), '`inst` should be `PublicStoreHandler`')
    return inst
  }

  /**
   * @param {Object} inst
   * @return {boolean}
   */
  static isStoreBase(inst) {
    return testClassTagName(inst, CLASS_TAG_NAME_STORE) || testClassTagName(inst, CLASS_TAG_NAME_PROXYSTORE) || testClassTagName(inst, CLASS_TAG_NAME_PUBLIC_STORE_HANDLER)
  }

  /**
   *
   * @param {StoreInterface} inst
   * @return {StoreInterface}
   */
  static assertStoreBase(inst) {
    assertType(TypeCheck.isStoreBase(inst),
      'TypeCheck:assertStoreBase: `inst` argument should be an StoreInterface'
    )
    return inst
  }

  /**
   * @param {Object} inst
   * @return {boolean}
   */
  static isViewContainer(inst) {
    return testClassTagName(inst, CLASS_TAG_NAME_VIEWCONTAINER)
  }

  /**
   * @param {ViewContainer} inst
   * @return {ViewContainer}
   * @throws {TypeError}
   */
  static assertIsViewContainer(inst) {
    assertType(TypeCheck.isViewContainer(inst), '`inst` should be a `ViewContainer`')
    return inst
  }

  /**
   * @param {Object} inst
   * @return {boolean}
   */
  static isView(inst) {
    return testClassTagName(inst, CLASS_TAG_NAME_VIEW)
  }

  /**
   * @param {View} inst
   * @return {View}
   * @throws {TypeError}
   */
  static assertIsView(inst) {
    assertType(TypeCheck.isView(inst), 'TypeCheck:assertIsView: `inst` argument should be a View')
    return inst
  }

  /**
   * @param {Object} inst
   * @return {boolean}
   */
  static isExecutor(inst) {
    return testClassTagName(inst, CLASS_TAG_NAME_EXECUTOR)
  }

  /**
   * @param {Object} inst
   * @return {boolean}
   */
  static isJob(inst) {
    return testClassTagName(inst, CLASS_TAG_NAME_JOB)
  }

  /**
   * @param {Object} inst
   * @return {boolean}
   */
  static isViewContainerBase(inst) {
    return testClassTagName(inst, CLASS_TAG_NAME_VIEWCONTAINER) || testClassTagName(inst, CLASS_TAG_NAME_VIEW)
  }

  /**
   * @param {ViewContainerBase} inst
   * @return {ViewContainerBase}
   * @throws {TypeError}
   */
  static assertIsViewContainerBase(inst) {
    assertType(TypeCheck.isViewContainerBase(inst), '`inst` argument should be a ViewContainerBase')
    return inst
  }

  /**
   * @param {ElementDescription} inst
   * @return {ElementDescription}
   * @throws {TypeError}
   */
  static assertIsElementDescription(inst) {
    assertType(TypeCheck.isElementDescription(inst), '`inst` argument should be a ElementDescription')
    return inst
  }

  /**
   * @param {*} instance
   * @return {boolean}
   */
  static isElementDescription(instance) {
    return instance instanceof ElementDescription
  }

  /**
   * @param {*} instance
   * @return {boolean}
   */
  static isRemovedException(instance) {
    return instance instanceof RemovedException
  }
}


export {TypeCheck}
