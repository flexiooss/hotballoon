export class ExecutionConfig {
  /**
   * @type {?Navigator}
   */
  #navigator

  /**
   * @param {?Navigator} navigator
   */
  constructor(navigator) {
    this.#navigator = navigator
  }

  /**
   * @return {?Navigator}
   */
  navigator() {
    return this.#navigator
  }
}
