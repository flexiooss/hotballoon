import {isNull, TypeCheck} from '@flexio-oss/js-commons-bundle/assert/index.js'
import 'scheduler-polyfill'
import {HBSchedulerTaskBuilderInterface} from "./HBSchedulerTaskBuilder.js";
import {HBTaskInterface} from "./HBTask.js";
import {HBTaskAbortException} from "./HBTaskAbortException.js";
import {PRIORITIES} from "./PRIORITIES.js";
import {SchedulerHandlerInterface} from "./SchedulerHandler.js";

export class BrowserSchedulerHandler extends SchedulerHandlerInterface(class {

}) {
  /**
   * @type {Window}
   */
  #global
  /**
   * @type {(callback: IdleRequestCallback, options?: IdleRequestOptions) => number}
   */
  #requestIdleCallback

  /**
   * @param {Window} global
   */
  constructor(global) {
    super()
    this.#global = TypeCheck.assertIsObject(global)
    if (!this.#global.requestIdleCallback) {
      /**
       * @type {(callback: IdleRequestCallback, options?: IdleRequestOptions) => number}
       */
      this.#requestIdleCallback = (callback,options) => this.#global.requestIdleCallback(callback,options)
    } else {
      this.#requestIdleCallback = (cb) => {
        return setTimeout(function () {
          const start = Date.now();
          cb({
            didTimeout: false,
            timeRemaining: function () {
              return Math.max(0, 50 - (Date.now() - start));
            }
          });
        }, 1);
      }
    }
  }

  /**
   * @param  {function} task
   * @return {HBSchedulerTaskBuilder}
   */
  postTask(task) {
    return new HBSchedulerTaskBuilderImpl(this.#global, task)
  }

  /**
   * @param {IdleRequestCallback} task
   * @return {number}
   */
  requestIdleCallback(task) {
    return this.#requestIdleCallback(task)
  }
}

class HBSchedulerTaskBuilderImpl extends HBSchedulerTaskBuilderInterface(class {

}) {
  /**
   * @type {Window}
   */
  #global
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
   * @param {Window} global
   * @param {function} task
   */
  constructor(global, task) {
    super()
    this.#global = global;
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
      this.#global,
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
   * @type {Window}
   */
  #global
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
   * @type {?TaskController}
   */
  #controller = null

  /**
   * @param {Window} global
   * @param {function} task
   * @param {string} priority
   * @param {?number} delay
   */
  constructor(global, task, priority, delay) {
    super()
    this.#global = global;
    this.#task = TypeCheck.assertIsFunction(task);
    this.#priority = priority;
    this.#delay = TypeCheck.assertIsNumberOrNull(delay);
    this.#controller = new this.#global.TaskController({priority: this.#priority})
  }

  /**
   * @return {Promise<*>}
   */
  async exec() {
    let options = {signal: this.#controller.signal}
    if (!isNull(this.#delay)) {
      options.delay = this.#delay
    }
    return this.#global.scheduler.postTask(this.#task, options)
  }

  abort() {
    if (!isNull(this.#controller)) {
      this.#controller.abort(new HBTaskAbortException())
      this.#controller = null
    }
    this.#task = null
  }

  /**
   * @return {HBTaskImpl}
   */
  toPriorityBlocking() {
    if (!isNull(this.#controller)) {
      this.#controller.setPriority(PRIORITIES.BLOCKING)
    }
    return this
  }

  /**
   * @return {HBTaskImpl}
   */
  toPriorityNormal() {
    if (!isNull(this.#controller)) {
      this.#controller.setPriority(PRIORITIES.VISIBLE)
    }
    return this
  }

  /**
   * @return {HBTaskImpl}
   */
  toPriorityBackground() {
    if (!isNull(this.#controller)) {
      this.#controller.setPriority(PRIORITIES.BACKGROUND)
    }
    return this
  }
}

