import {
  CLASS_TAG_NAME_ACTION,
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
  CLASS_TAG_NAME_SERVICE,
  testClassTagName
} from './HasTagClassNameInterface'
import {assertType} from '@flexio-oss/js-commons-bundle/assert'
import {ElementDescription} from '../HotballoonNodeElement/ElementDescription'


class TypeCheck {
  /**
   *
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
    assertType(TypeCheck.isHotballoonApplication(inst),
      '`inst` should be an HotballoonApplication'
    )
    return inst
  }

  /**
   *
   * @param {Object} inst
   * @return {boolean}
   */
  static isDispatcher(inst) {
    return testClassTagName(inst, CLASS_TAG_NAME_DISPATCHER)
  }

  /**
   *
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
   *
   * @param {Object} inst
   * @return {boolean}
   */
  static isActionDispatcher(inst) {
    return testClassTagName(inst, CLASS_TAG_NAME_ACTION)
  }

  /**
   * @param {ActionDispatcher} inst
   * @return {ActionDispatcher}
   * @throws {TypeError}
   */
  static assertIsActionDispatcher(inst) {
    assertType(TypeCheck.isActionDispatcher(inst),
      'TypeCheck:assertIsActionDispatcher: `inst` argument should be an ActionDispatcher'
    )
    return inst
  }

  /**
   *
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
   *
   * @param {Object} inst
   * @return {boolean}
   */
  static isProxyStore(inst) {
    return testClassTagName(inst, CLASS_TAG_NAME_PROXYSTORE)
  }

  /**
   *
   * @param {Object} inst
   * @return {boolean}
   */
  static isPublicStoreHandler(inst) {
    return testClassTagName(inst, CLASS_TAG_NAME_PUBLIC_STORE_HANDLER)
  }

  /**
   *
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
   *
   * @param {Object} inst
   * @return {boolean}
   */
  static isViewContainer(inst) {
    return testClassTagName(inst, CLASS_TAG_NAME_VIEWCONTAINER)
  }

  /**
   *
   * @param {Object} inst
   * @return {boolean}
   */
  static isView(inst) {
    return testClassTagName(inst, CLASS_TAG_NAME_VIEW)
  }

  /**
   * @param {View} inst
   * @return {View}
   */
  static assertIsView(inst) {
    assertType(TypeCheck.isView(inst),
      'TypeCheck:assertIsView: `inst` argument should be a View'
    )
    return inst
  }

  /**
   *
   * @param {Object} inst
   * @return {boolean}
   */
  static isExecutor(inst) {
    return testClassTagName(inst, CLASS_TAG_NAME_EXECUTOR)
  }

  /**
   *
   * @param {Object} inst
   * @return {boolean}
   */
  static isJob(inst) {
    return testClassTagName(inst, CLASS_TAG_NAME_JOB)
  }

  /**
   *
   * @param {HotballoonService} inst
   * @return {boolean}
   */
  static isService(inst) {
    return testClassTagName(inst, CLASS_TAG_NAME_SERVICE)
  }

  /**
   *
   * @param {Object} inst
   * @return {boolean}
   */
  static isViewContainerBase(inst) {
    return testClassTagName(inst, CLASS_TAG_NAME_VIEWCONTAINER) || testClassTagName(inst, CLASS_TAG_NAME_VIEW)
  }

  /**
   *
   * @param {*} instance
   * @return {boolean}
   */
  static isElementDescription(instance) {
    return instance instanceof ElementDescription
  }
}


export {TypeCheck}
