import {assertInstanceOf, assertType, TypeCheck} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {Dispatcher} from '../Dispatcher/Dispatcher.js'
import {ViewRenderConfig} from './ViewRenderConfig.js'
import {ComponentsContextHandler} from '../Component/ComponentsContextHandler.js'
import {ExecutionConfig} from './ExecutionConfig.js'
import {implementsSchedulerHandlerInterface} from "../Scheduler/SchedulerHandler.js";

export class HotballoonApplicationConfig {

  /**
   * @type {string}
   */
  #id
  /**
   * @type {ComponentsContextHandler}
   */
  #components
  /**
   * @type {Dispatcher}
   */
  #dispatcher
  /**
   * @type {ViewRenderConfig}
   */
  #viewRenderConfig
  /**
   * @type {ExecutionConfig}
   */
  #executionConfig
  /**
   * @type {SchedulerHandler}
   */
  #schedulerHandler

  /**
   * @param {string} id
   * @param {Dispatcher} dispatcher
   * @param {ViewRenderConfig} viewRenderConfig
   * @param {ComponentsContextHandler} componentsContextHandler
   * @param {ExecutionConfig} executionConfig
   * @param {SchedulerHandler} schedulerHandler
   */
  constructor(id, dispatcher, viewRenderConfig, componentsContextHandler, executionConfig, schedulerHandler) {
    this.#id = TypeCheck.assertIsString(id)
    this.#dispatcher = assertInstanceOf(dispatcher, Dispatcher, 'Dispatcher')
    this.#viewRenderConfig = assertInstanceOf(viewRenderConfig, ViewRenderConfig, 'ViewRenderConfig')
    this.#components = assertInstanceOf(componentsContextHandler, ComponentsContextHandler, 'ComponentsContextHandler')
    this.#executionConfig = assertInstanceOf(executionConfig, ExecutionConfig, 'ExecutionConfig')
    assertType(implementsSchedulerHandlerInterface(schedulerHandler), 'should be SchedulerHandler')
    this.#schedulerHandler = schedulerHandler
  }

  /**
   * @return {SchedulerHandler}
   */
  schedulerHandler() {
    return this.#schedulerHandler
  }

  /**
   * @return {string}
   */
  id() {
    return this.#id
  }

  /**
   * @return {Dispatcher}
   */
  dispatcher() {
    return this.#dispatcher
  }

  /**
   * @return {ViewRenderConfig}
   */
  viewRenderConfig() {
    return this.#viewRenderConfig
  }

  /**
   * @return {ExecutionConfig}
   */
  executionConfig() {
    return this.#executionConfig
  }

  /**
   * @return {ComponentsContextHandler}
   */
  components() {
    return this.#components
  }
}
