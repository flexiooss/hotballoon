import {AlreadyRegisteredException} from '../Exception/AlreadyRegisteredException'
import {ComponentContextMap} from './ComponentContextMap'

export class ComponentsContextHandler {
  /**
   * @type {ComponentContextMap}
   */
  #components = new ComponentContextMap()
  /**
   * @type {LoggerInterface}
   */
  #logger

  /**
   * @param {LoggerInterface} logger
   */
  constructor(logger) {
    this.#logger = logger
  }

  /**
   * @param {ComponentContext} componentContext
   * @return {ComponentContext}
   */
  attach(componentContext) {
    if (this.#components.has(componentContext.ID())) {
      throw AlreadyRegisteredException.COMPONENT(componentContext.ID())
    }
    this.#components.set(componentContext.ID(), componentContext)
    return componentContext
  }

  /**
   * @param {ComponentContext} componentContext
   * @return {ComponentsContextHandler}
   */
  detach(componentContext) {
    this.#components.delete(componentContext.ID())
    return this
  }

  /**
   * @return {ComponentsContextHandler}
   */
  clear() {
    this.#components.clear()
    return this
  }

  remove() {
    this.#components.forEach(v => {
      v.remove()
    })
    this.clear()
  }

}
