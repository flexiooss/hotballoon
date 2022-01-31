import {ComponentContext} from '../Component/ComponentContext'
import {ActionsHandler} from '../Action/ActionsHandler'
import {StoresHandler} from '../Store/StoresHandler'
import {ViewContainersHandler} from '../View/ViewContainersHandler'
import {isNull} from '@flexio-oss/js-commons-bundle/assert'

export class ComponentContextBuilder {
  /**
   * @type {HotBalloonApplication}
   */
  #application
  /**
   * @type {?string}
   */
  #name = null

  /**
   * @param {HotBalloonApplication} v
   * @return {ComponentContextBuilder}
   */
  application(v) {
    this.#application = v
    return this
  }

  /**
   * @param {?string} v
   * @return {ComponentContextBuilder}
   */
  name(v) {
    this.#name = v
    return this
  }

  /**
   * @return {ComponentContext}
   */
  build() {
    return new ComponentContext(
      this.#application,
      !isNull(this.#name)
        ? `${this.#application.nextID()}--${this.#name.replace(new RegExp('\\\\s+', 'g'), '')}`
        : this.#application.nextID(),
      new ActionsHandler(),
      new StoresHandler(),
      new ViewContainersHandler()
    )
  }
}
