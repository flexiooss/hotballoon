import {TypeCheck, NotOverrideException} from '@flexio-oss/js-commons-bundle/assert'

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

  constructor(window) {
    super()
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
   */
  #runTasks(tasks) {
    let task
    while (task = tasks.shift()) {
      task.call(null)
    }
  }

  /**
   * @param {Function} task
   * @return {*}
   */
  read(task) {
    console.log('read')
    this.#reads.push(TypeCheck.assertIsFunction(task))
    this.#scheduleFlush()
    return this
  }

  /**
   * @param {Function} task
   * @return {*}
   */
  write(task) {
    console.log('write')
    this.#writes.push(TypeCheck.assertIsFunction(task))
    this.#scheduleFlush()
    return this
  }

  #scheduleFlush() {
    if (!this.#scheduled) {
      this.#scheduled = true
      this.#requestAnimationFrame(() => {
        this.#flush()
      })
    }
  }

  #flush() {

    try {
      console.log('flushing reads', this.#reads.length)
      this.#runTasks(this.#reads)
      console.log('flushing writes', this.#writes.length)
      this.#runTasks(this.#writes)
    } catch (e) {
      console.log(e)
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
