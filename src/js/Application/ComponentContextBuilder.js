import {ComponentContext} from '../Component/ComponentContext'
import {ActionsHandler} from '../Action/ActionsHandler'
import {StoresHandler} from '../Store/StoresHandler'
import {ViewContainersHandler} from '../View/ViewContainersHandler'

export class ComponentContextBuilder {
  /**
   * @type {HotBalloonApplication}
   */
  #application

  /**
   * @param {HotBalloonApplication} v
   * @return {ComponentContextBuilder}
   */
  application(v) {
    this.#application = v
    return this
  }

  /**
   * @return {ComponentContext}
   */
  build() {
    return new ComponentContext(
      this.#application,
      new ActionsHandler(this.#application.logger()),
      new StoresHandler(this.#application.logger()),
      new ViewContainersHandler(this.#application.logger())
    )
  }
}
