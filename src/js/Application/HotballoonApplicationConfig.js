import {assertInstanceOf, TypeCheck} from '@flexio-oss/js-commons-bundle/assert'
import {Dispatcher} from '../Dispatcher/Dispatcher'
import {ViewRenderConfig} from './ViewRenderConfig'
import {ComponentsContextHandler} from '../Component/ComponentsContextHandler'
import {ExecutionConfig} from './ExecutionConfig'

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
   * @param {string} id
   * @param {Dispatcher} dispatcher
   * @param {ViewRenderConfig} viewRenderConfig
   * @param {ComponentsContextHandler} componentsContextHandler
   * @param {ExecutionConfig} executionConfig
   */
  constructor(id, dispatcher,  viewRenderConfig, componentsContextHandler, executionConfig) {
    this.#id = TypeCheck.assertIsString(id)
    this.#dispatcher = assertInstanceOf(dispatcher, Dispatcher, 'Dispatcher')
    this.#viewRenderConfig = assertInstanceOf(viewRenderConfig, ViewRenderConfig, 'ViewRenderConfig')
    this.#components = assertInstanceOf(componentsContextHandler, ComponentsContextHandler, 'ComponentsContextHandler')
    this.#executionConfig = assertInstanceOf(executionConfig, ExecutionConfig, 'ExecutionConfig')
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
