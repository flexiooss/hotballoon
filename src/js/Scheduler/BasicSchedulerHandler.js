import {isNull, NotOverrideException, TypeCheck} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {HBTaskAbortException} from "./HBTaskAbortException.js";
import {PRIORITIES} from "./PRIORITIES.js";
import {HBTaskInterface} from "./HBTask.js";
import {HBSchedulerTaskBuilderInterface} from "./HBSchedulerTaskBuilder.js";
import {SchedulerHandlerInterface} from "./SchedulerHandler.js";

export class BasicSchedulerHandler extends SchedulerHandlerInterface(class {

}) {

  /**
   * @param  {function} task
   * @return {HBSchedulerTaskBuilder}
   */
  postTask(task) {
    return new HBSchedulerTaskBuilderImpl(task)
  }

  /**
   * @param {IdleRequestCallback} task
   * @return {number}
   */
  requestIdleCallback(task) {
    return setTimeout(function () {
      const start = Date.now();
      task({
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50 - (Date.now() - start));
        }
      });
    }, 1)
  }
}

class HBSchedulerTaskBuilderImpl extends HBSchedulerTaskBuilderInterface(class {

}) {
  /**
   * @type {?function}
   */
  #task = null
  /**
   * @type {string}
   */
  #priority = PRIORITIES.VISIBLE
  /**
   * @type {?number}
   */
  #delay = null

  /**
   * @param {function} task
   */
  constructor(task) {
    super()
    this.#task = task;
  }

  /**
   * @return {HBSchedulerTaskBuilder}
   */
  blocking() {
    this.#priority = PRIORITIES.BLOCKING
    return this
  }

  /**
   * @return {HBSchedulerTaskBuilder}
   */
  background() {
    this.#priority = PRIORITIES.BACKGROUND
    return this
  }

  /**
   * @param {number} value - ms
   * @return {HBSchedulerTaskBuilder}
   */
  delay(value) {
    this.#delay = value
    return this
  }

  /**
   * @return {HBTask}
   */
  build() {
    return new HBTaskImpl(
      this.#task,
      this.#priority,
      this.#delay
    )
  }
}

/**
 * @implements {HBTask}
 */
class HBTaskImpl extends HBTaskInterface() {
  /**
   * @type {function}
   */
  #task
  /**
   * @type {?number}
   */
  #delay
  /**
   * @type {string}
   */
  #priority
  /**
   * @type {?number}
   */
  #token = null

  /**
   * @param {function} task
   * @param {string} priority
   * @param {?number} delay
   */
  constructor(task, priority, delay) {
    super()
    this.#task = TypeCheck.assertIsFunction(task);
    this.#priority = priority;
    this.#delay = TypeCheck.assertIsNumberOrNull(delay);
  }

  /**
   * @return {Promise<*>}
   */
  async exec() {
    if (this.#priority === PRIORITIES.BLOCKING) {
      return this.#task.call(null)
    } else {
      return new Promise((ok, ko) => {
        this.#token = setTimeout(() => {
          if (!isNull(this.#task)) {
            ok(this.#task.call(null), this.#delay ?? 0)
          } else {
            ko(new HBTaskAbortException())
          }
        })
      })
    }
  }

  abort() {
    if (!isNull(this.#token)) {
      clearTimeout(this.#token)
    }
    this.#task = null
  }

  /**
   * @return {HBTask}
   */
  toPriorityBlocking() {
    return this
  }

  /**
   * @return {HBTask}
   */
  toPriorityNormal() {
    return this
  }

  /**
   * @return {HBTask}
   */
  toPriorityBackground() {
    return this
  }

}


