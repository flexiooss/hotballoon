import {TypeCheck, NotOverrideException, isUndefined, assertType} from '@flexio-oss/js-commons-bundle/assert'
import {DOMError} from "../Exception/DOMError";
import {Logger} from "@flexio-oss/js-commons-bundle/hot-log";

/**
 * @interface
 */
export class DomAccessor {
  /**
   * @param {Function} task
   * @return {*}
   */
  read(task) {
    throw NotOverrideException.FROM_INTERFACE('DomAccessor')
  }

  /**
   * @param {Function} task
   * @return {*}
   */
  write(task) {
    throw NotOverrideException.FROM_INTERFACE('DomAccessor')
  }

  /**
   * @return {this}
   */
  clear() {
    throw NotOverrideException.FROM_INTERFACE('DomAccessor')
  }
}

/**
 * @implements {DomAccessor}
 */
export class AsyncDomAccessor extends DomAccessor {
  /**
   * @type {Window}
   */
  #window
  /**
   * @type {Function}
   */
  #requestAnimationFrame
  /**
   * @type {Function[]}
   */
  #reads = []
  /**
   * @type {Function[]}
   */
  #writes = []
  /**
   * @type {boolean}
   */
  #scheduled = false
  /**
   * @type {Logger}
   */
  #logger = Logger.getLogger(this.constructor.name,'AsyncDomAccessor' )

  constructor(window) {
    super()
    assertType(!isUndefined(window), '`window` should not be empty')
    this.#window = window
    this.#requestAnimationFrame = this.#window.requestAnimationFrame
      || this.#window.webkitRequestAnimationFrame
      || this.#window.mozRequestAnimationFrame
      || this.#window.msRequestAnimationFrame
      || function (cb) {
        return setTimeout(cb, 16)
      }
  }

  /**
   * @param {Function[]} tasks
   * @param {number} start
   * @return {boolean}
   */
  #runTasks(tasks, start) {
    let task
    while (task = tasks.shift()) {
      task.call(null)
      if ((Date.now() - start) > 12) {
        return false
      }
    }
    return true
  }

  /**
   * @param {Function} task
   * @return {AsyncDomAccessor}
   */
  read(task) {
    this.#logger.debug('READ')
    this.#reads.push(TypeCheck.assertIsFunction(task))
    this.#scheduleFlush()
    return this
  }

  /**
   * @param {Function} task
   * @return {*}
   */
  write(task) {
    this.#logger.debug('WRITE')
    this.#writes.push(TypeCheck.assertIsFunction(task))
    this.#scheduleFlush()
    return this
  }

  #scheduleFlush() {
    if (!this.#scheduled) {
      this.#scheduled = true
      this.#requestAnimationFrame.call(this.#window, () => {
        this.#flush()
      })
    }
  }

  #flush() {
    /**
     * @type {number}
     */
    const start = Date.now()
    try {
      this.#logger.debug('FLUSHING READS:'+this.#reads.length)
      if (this.#runTasks(this.#reads, start)) {
        this.#logger.debug('FLUSHING WRITES:'+this.#writes.length)
        this.#runTasks(this.#writes, start)
      }
    } catch (e) {
      const error = new DOMError(e.toString())
      error.stack = e.stack
      this.#logger.error('UNEXPECTED FLUSHING ERROR', error)
    }

    this.#scheduled = false

    if (this.#reads.length || this.#writes.length) {
      this.#scheduleFlush()
    }
  }

  /**
   * @return {this}
   */
  clear() {
    this.#reads = []
    this.#writes = []
    return this
  }
}

/**
 * @implements {DomAccessor}
 */
export class SyncDomAccessor extends DomAccessor {
  /**
   * @param {Function} task
   * @return {*}
   */
  read(task) {
    task.call(null)
  }

  /**
   * @param {Function} task
   * @return {*}
   */
  write(task) {
    task.call(null)
  }

  /**
   * @return {this}
   */
  clear() {
    return this
  }
}
