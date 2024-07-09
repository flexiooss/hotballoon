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
import {assertType, formatType, isNull} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {ElementDescription} from '../HotballoonNodeElement/ElementDescription.js'
import {RemovedException} from "../Exception/RemovedException.js";
import {implementsHBComponent} from "../Component/Component.js";
import {implementsListenedEvent} from "../Event/ListenedEvent.js";


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
    assertType(TypeCheck.isHotballoonApplication(inst), '`inst` should be an HotballoonApplication')
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
   * @param {ActionDispatcher<*>} inst
   * @param {?Class} [typeOf=null]
   * @return {boolean}
   */
  static isActionDispatcher(inst, typeOf = null) {
    return testClassTagName(inst, CLASS_TAG_NAME_ACTION_DISPATCHER) && (!isNull(typeOf) ? inst.isTypeOf(typeOf) : true)
  }

  /**
   * @param {ActionDispatcher<*>} inst
   * @param {?Class} [typeOf=null]
   * @param {?string} [stringName=null]
   * @return {ActionDispatcher<*>}
   * @throws {TypeError}
   */
  static assertIsActionDispatcher(inst, typeOf = null, stringName = null) {
    assertType(
      TypeCheck.isActionDispatcher(inst, typeOf),
      () => `should be an ActionDispatcher<${stringName ?? '*'}, given:${formatType(inst)}>`
    )
    return inst
  }

  /**
   * @param {Object} inst
   * @param {?Class} [typeOf=null]
   * @return {boolean}
   */
  static isActionSubscriber(inst, typeOf = null) {
    return (testClassTagName(inst, CLASS_TAG_NAME_ACTION_SUBSCRIBER) || TypeCheck.isActionDispatcher(inst)) && (!isNull(typeOf) ? inst.isTypeOf(typeOf) : true)
  }

  /**
   * @param {ActionSubscriber<*>} inst
   * @param {?Class} [typeOf=null]
   * @param {?string} [stringName=null]
   * @return {ActionSubscriber<*>}
   * @throws {TypeError}
   */
  static assertIsActionSubscriber(inst, typeOf = null, stringName = null) {
    assertType(
      TypeCheck.isActionSubscriber(inst, typeOf),
      () => `should be an ActionSubscriber<${stringName ?? '*'}, given:${formatType(inst)}>`
    )
    return inst
  }

  /**
   * @param {Store<*>} inst
   * @param {?Class} [typeOf=null]
   * @return {boolean}
   */
  static isStore(inst, typeOf = null) {
    return testClassTagName(inst, CLASS_TAG_NAME_STORE) && (!isNull(typeOf) ? inst.isTypeOf(typeOf) : true)
  }

  /**
   * @param {Store<*>} inst
   * @param {?Class} [typeOf=null]
   * @param {?string} [stringName=null]
   * @return {Store<*>}
   * @throws {TypeError}
   */
  static assertIsStore(inst, typeOf = null, stringName = null) {
    assertType(TypeCheck.isStore(inst, typeOf),
      () => `should be an Store<${stringName ?? '*'}, given:${formatType(inst)}>`)
    return inst
  }

  /**
   * @param {?Store<*,*>} inst
   * @param {?Class} [typeOf=null]
   * @param {?string} [stringName=null]
   * @return {Store<*>}
   * @throws {TypeError}
   */
  static assertIsStoreOrNull(inst, typeOf = null, stringName = null) {
    return (isNull(inst)) ? inst : TypeCheck.assertIsStore(inst, typeOf, stringName)
  }

  /**
   * @param {Object} inst
   * @param {?Class} [typeOf=null]
   * @return {boolean}
   */
  static isProxyStore(inst, typeOf = null) {
    return testClassTagName(inst, CLASS_TAG_NAME_PROXYSTORE) && (!isNull(typeOf) ? inst.isTypeOf(typeOf) : true)
  }

  /**
   * @param {ProxyStore<*>} inst
   * @param {?Class} [typeOf=null]
   * @param {?string} [stringName=null]
   * @return {ProxyStore<*>}
   * @throws {TypeError}
   */
  static assertIsProxyStore(inst, typeOf = null, stringName = null) {
    assertType(TypeCheck.isProxyStore(inst, typeOf),
      () => `should be an ProxyStore<${stringName ?? '*'}, given:${formatType(inst)}>`)
    return inst
  }

  /**
   * @param {PublicStoreHandler<*>} inst
   * @param {?Class} [typeOf=null]
   * @return {boolean}
   */
  static isPublicStoreHandler(inst, typeOf = null) {
    return testClassTagName(inst, CLASS_TAG_NAME_PUBLIC_STORE_HANDLER) && (!isNull(typeOf) ? inst.isTypeOf(typeOf) : true)
  }

  /**
   * @param {PublicStoreHandler<*>} inst
   * @param {?Class} [typeOf=null]
   * @param {?string} [stringName=null]
   * @return {PublicStoreHandler<*>}
   * @throws {TypeError}
   */
  static assertIsPublicStoreHandler(inst, typeOf = null, stringName = null) {
    assertType(TypeCheck.isPublicStoreHandler(inst,typeOf), () => `should be an PublicStoreHandler<${stringName ?? '*'}, given:${formatType(inst)}>`)

    return inst
  }

  /**
   * @param {StoreBase<*>} inst
   * @param {?Class} [typeOf=null]
   * @return {boolean}
   */
  static isStoreBase(inst,typeOf = null) {
    return (testClassTagName(inst, CLASS_TAG_NAME_STORE) || testClassTagName(inst, CLASS_TAG_NAME_PROXYSTORE) || testClassTagName(inst, CLASS_TAG_NAME_PUBLIC_STORE_HANDLER)) &&  (!isNull(typeOf) ? inst.isTypeOf(typeOf) : true)
  }

  /**
   *
   * @param {StoreBase<*>} inst
   * @param {?Class} [typeOf=null]
   * @param {?string} [stringName=null]
   * @return {StoreBase<*>}
   */
  static assertStoreBase(inst, typeOf = null, stringName = null) {
    assertType(TypeCheck.isStoreBase(inst,typeOf ),
      () => `should be an StoreBase<${stringName ?? '*'}, given:${formatType(inst)}>`
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

  /**
   * @param {*} instance
   * @return {boolean}
   */
  static implementsComponent(instance) {
    return implementsHBComponent(instance)
  }

  /**
   * @param {Component} instance
   * @return {Component}
   * @throws {TypeError}
   */
  static assertImplementsComponent(instance) {
    assertType(implementsHBComponent(instance), 'should be a Component')
    return instance
  }

  /**
   * @param {ListenedEvent} inst
   * @return {boolean}
   */
  static implementsListenedEvent(inst) {
    return implementsListenedEvent(inst)
  }

  /**
   * @param {ListenedEvent} instance
   * @return {ListenedEvent}
   * @throws {TypeError}
   */
  static assertImplementsListenedEvent(instance) {
    assertType(implementsListenedEvent(instance), 'should be a ListenedEvent')
    return instance
  }

}


export {TypeCheck}
