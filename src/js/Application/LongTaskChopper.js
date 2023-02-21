export class LongTaskChopper {
  /**
   * @type {HotballoonApplicationConfig}
   */
  #config

  /**
   * @param {HotballoonApplicationConfig} config
   */
  constructor(config) {
    this.#config = config;
  }

  static yieldToMain() {
    return new Promise(resolve => {
      setTimeout(resolve, 0);
    });
  }

  /**
   * @param {...function} tasks
   * @return {RunnerMulti}
   */
  forTasks(...tasks) {
    return new RunnerMulti(this.#config, tasks)
  }

  /**
   * @return {Runner}
   */
  runner() {
    return new Runner(this.#config)
  }

}

class AbstractRunner {
  /**
   * @type {number}
   */
  #deadline
  /**
   * @type {HotballoonApplicationConfig}
   */
  #config

  /**
   * @param {HotballoonApplicationConfig} config
   */
  constructor(config) {
    this.#config = config;
  }

  /**
   * @protected
   * @return {number}
   */
  _now() {
    return this.#config.viewRenderConfig().document()?.defaultView?.performance?.now() ?? new Date().getTime()
  }

  /**
   * @protected
   * @return {boolean}
   */
  _isInputPending() {
    return this.#config.executionConfig().navigator()?.scheduling?.isInputPending() ?? false
  }

  /**
   * @protected
   */
  _updateDeadLine() {
    this.#deadline = this._now() + 50;
  }

  /**
   * @protected
   * @return {number}
   */
  _deadline() {
    return this.#deadline
  }
}


class RunnerMulti extends AbstractRunner {
  /**
   * @type {function[]}
   */
  #tasks

  /**
   * @param {HotballoonApplicationConfig} config
   * @param {function[]} tasks
   */
  constructor(config, tasks) {
    super(config)
    this.#tasks = tasks;
  }

  /**
   * @return {Promise<*[]>}
   */
  async exec() {
    return new Promise(async (ok) => {

      this._updateDeadLine()
      let results = []
      while (this.#tasks.length > 0) {
        if (this._isInputPending() || (this._now() >= this._deadline())) {
          await LongTaskChopper.yieldToMain();
          this._updateDeadLine()
          continue;
        }
        const task = this.#tasks.shift();
        results.push(await task.call(null));
      }
      ok(results)
    })
  }
}

class Runner extends AbstractRunner {

  /**
   * @param {HotballoonApplicationConfig} config
   */
  constructor(config) {
    super(config)
    this._updateDeadLine()
  }

  /**
   * @param {function} task
   * @return {Promise<unknown>}
   */
  async exec(task) {
    if (this._isInputPending() || (this._now() >= this._deadline())) {
      await LongTaskChopper.yieldToMain();
      this._updateDeadLine()

    }
    return task.call(null)
  }
}