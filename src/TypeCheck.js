import {
  testClassTagName,
  CLASS_TAG_NAME_HOTBALLOON_APPLICATION,
  CLASS_TAG_NAME_DISPATCHER,
  CLASS_TAG_NAME_COMPONENT,
  CLASS_TAG_NAME_ACTION,
  CLASS_TAG_NAME_STORE,
  CLASS_TAG_NAME_PROXYSTORE,
  CLASS_TAG_NAME_VIEWCONTAINER,
  CLASS_TAG_NAME_VIEW, CLASS_TAG_NAME_PUBLIC_STORE_HANDLER
} from './HasTagClassNameInterface'

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
   *
   * @param {Object} inst
   * @return {boolean}
   */
  static isAction(inst) {
    return testClassTagName(inst, CLASS_TAG_NAME_ACTION)
  }

  /**
   *
   * @param {Object} inst
   * @return {boolean}
   */
  static isStore(inst) {
    return testClassTagName(inst, CLASS_TAG_NAME_STORE)
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
   *
   * @param {Object} inst
   * @return {boolean}
   */
  static isViewContainerBase(inst) {
    return testClassTagName(inst, CLASS_TAG_NAME_VIEWCONTAINER) || testClassTagName(inst, CLASS_TAG_NAME_VIEW)
  }
}

export {TypeCheck}
