import {isNull, TypeCheck} from '@flexio-oss/js-commons-bundle/assert'
import 'scheduler-polyfill'
import {HBSchedulerTaskBuilderInterface} from "./HBSchedulerTaskBuilder";
import {HBTaskInterface} from "./HBTask";
import {HBTaskAbortException} from "./HBTaskAbortException";
import {PRIORITIES} from "./PRIORITIES";
import {SchedulerHandlerInterface} from "./SchedulerHandler";

export class BrowserSchedulerHandler extends SchedulerHandlerInterface(class  {

}){
  /**
   * @type {Window}
   */
  #global

  /**
   * @param {Window} global
   */
  constructor(global) {
    super()
    this.#global = TypeCheck.assertIsObject(global)
  }

  /**
   * @param  {function} task
   * @return {HBSchedulerTaskBuilder}
   */
  postTask(task) {
    return new HBSchedulerTaskBuilderImpl(this.#global, task)
  }
}

class HBSchedulerTaskBuilderImpl extends HBSchedulerTaskBuilderInterface(class  {

}){
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

class HBTaskImpl extends HBTaskInterface(class {

}) {
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
  }

  /**
   * @return {Promise<*>}
   */
  async exec() {
    this.#controller = new this.#global.TaskController()
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

