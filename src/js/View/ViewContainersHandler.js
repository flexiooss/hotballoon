import {ViewContainerMap} from './ViewContainerMap.js'
import {AlreadyRegisteredException} from '../Exception/AlreadyRegisteredException.js'

export class ViewContainersHandler {
  #viewContainers = new ViewContainerMap()

  /**
   * @param {ViewContainer} viewContainer
   * @return {ViewContainer}
   */
  attach(viewContainer) {
    if (this.#viewContainers.has(viewContainer.ID())) {
      throw AlreadyRegisteredException.VIEW_CONTAINER(viewContainer.ID())
    }
    this.#viewContainers.set(viewContainer.ID(), viewContainer)
    return viewContainer
  }

  /**
   * @param {ViewContainer} viewContainer
   * @return {ViewContainersHandler}
   */
  detach(viewContainer) {
    if (this.#viewContainers.has(viewContainer.ID())) {
      this.#viewContainers.delete(viewContainer.ID())
    }
    return this
  }

  remove() {
    this.#viewContainers.forEach(v => v.remove())
    this.clear()
  }

  /**
   * @return {ViewContainersHandler}
   */
  clear() {
    this.#viewContainers.clear()
    return this
  }
}
