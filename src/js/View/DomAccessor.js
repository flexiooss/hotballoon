import {TypeCheck, NotOverrideException, isUndefined, assertType} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {DOMError} from "../Exception/DOMError.js";
import {Logger} from '@flexio-oss/js-commons-bundle/hot-log/index.js';
import {isNull} from "@flexio-oss/js-commons-bundle/assert";

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

  /**
   * @return {RafThrottleBuilder}
   */
  rafThrottleBuilder() {
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
  #logger = Logger.getLogger(this.constructor.name, 'AsyncDomAccessor')

  /**
   * @param {Window} window
   */
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
   * @return {RafThrottleBuilder}
   */
  rafThrottleBuilder() {
    return new RafThrottleBuilder(this.#window)
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
      this.#logger.debug('FLUSHING READS:' + this.#reads.length)
      if (this.#runTasks(this.#reads, start)) {
        this.#logger.debug('FLUSHING WRITES:' + this.#writes.length)
        this.#runTasks(this.#writes, start)
      }
    } catch (e) {
      const error = DOMError.fromError(e)
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

  /**
   * @return {RafThrottleBuilder}
   */
  rafThrottleBuilder() {
    return new RafThrottleBuilder(null)
  }
}

class RafThrottleBuilder {
  /**
   * @type ?window
   */
  #window

  constructor(window) {
    this.#window = window;
  }

  /**
   * @param {function} task
   * @return {RafThrottle}
   */
  build(task) {
    return new RafThrottle(this.#window, task)
  }
}

class RafThrottle {
  /**
   * @type ?window
   */
  #window
  /**
   * @type function
   */
  #task
  /**
   * @type {?number}
   */
  #requestId = null
  /**
   * @type ?[]
   */
  #lastArgs

  /**
   * @param {?window} window
   * @param {function} task
   */
  constructor(window, task) {
    this.#window = window;
    this.#task = task;
  }

  /**
   * @param {Object} context
   * @param {...Any} args
   */
  invoke(context, ...args) {
    this.#lastArgs = args;
    if (isNull(this.#requestId)) {
      if (isNull(this.#window)) {
        this.#requestId = setTimeout(this.#later.bind(this, context), 16)
      } else {
        this.#requestId = this.#window.requestAnimationFrame(this.#later.bind(this, context))
      }
    }
  }

  cancel() {
    if (!isNull(this.#requestId)) {
      if (isNull(this.#window)) {
        clearTimeout(this.#requestId)
      } else {
        this.#window.cancelAnimationFrame(this.#requestId)
      }
      this.#requestId = null
    }
  }

  #later(context) {
    this.#requestId = null
    this.#task.apply(context, this.#lastArgs)
  }


}