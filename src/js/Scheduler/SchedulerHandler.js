import {isNull, TypeCheck} from '@flexio-oss/js-commons-bundle/assert'
import {BaseException} from "@flexio-oss/js-commons-bundle/js-type-helpers";

export class SchedulerHandler {
  /**
   * @type {Window}
   */
  #global

  /**
   * @param {Window} global
   */
  constructor(global) {
    this.#global = TypeCheck.assertIsObject(global)
    this.#ensureScheduler()
  }

  /**
   * @return {SchedulerHandler}
   */
  #ensureScheduler() {
    if (!'scheduler' in this.#global) {
      import('scheduler-polyfill')
    }
    return this
  }

  /**
   * @param  {function} task
   * @return {HBSchedulerTaskBuilder}
   */
  postTask(task) {
    return new HBSchedulerTaskBuilder(this.#global, task)
  }
}

class HBSchedulerTaskBuilder {
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
  constructor(global,task) {
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
    return new HBTask(
      this.#global,
      this.#task,
      this.#priority,
      this.#delay
    )
  }
}

class HBTask {
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
    this.#global = global;
    this.#task = TypeCheck.assertIsFunction(task);
    this.#priority = priority;
    this.#delay = TypeCheck.assertIsNumberOrNull(delay);

  }

  /**
   * @return {Promise<*>}
   */
  exec() {
    this.#controller = new TaskController()
    let options = {priority: this.#priority, signal: this.#controller.signal}
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
}

class HBTaskAbortException extends BaseException {

  realName() {
    return 'HBTaskAbortException'
  }
}

const PRIORITIES = {
  BLOCKING: 'user-blocking',
  VISIBLE: 'user-visible',
  BACKGROUND: 'background'
}