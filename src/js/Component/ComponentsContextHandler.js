import {AlreadyRegisteredException} from '../Exception/AlreadyRegisteredException'
import {ComponentContextMap} from './ComponentContextMap'
import {Logger} from "@flexio-oss/js-commons-bundle/hot-log";

export class ComponentsContextHandler {
  /**
   * @type {ComponentContextMap}
   */
  #components = new ComponentContextMap()
  /**
   * @type {Logger}
   */
  #logger = Logger.getLogger(this.constructor.name, 'HotBalloon.ComponentsContextHandler')

  /**
   * @param {ComponentContext} componentContext
   * @return {ComponentContext}
   */
  attach(componentContext) {
    if (this.#components.has(componentContext.ID())) {
      throw AlreadyRegisteredException.COMPONENT(componentContext.ID())
    }
    this.#logger.debug('Attach new ComponentContext:' + componentContext.ID())
    this.#components.set(componentContext.ID(), componentContext)
    return componentContext
  }

  /**
   * @param {ComponentContext} componentContext
   * @return {ComponentsContextHandler}
   */
  detach(componentContext) {
    this.#components.delete(componentContext.ID())
    this.#logger.debug('Detach new ComponentContext:' + componentContext.ID())
    return this
  }

  /**
   * @return {ComponentsContextHandler}
   */
  clear() {
    this.#components.clear()
    this.#logger.debug('clear all ComponentContexts')
    return this
  }

  remove() {
    this.#components.forEach(v => {
      v.remove()
    })
    this.clear()
  }

}
