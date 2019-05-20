import {CLASS_TAG_NAME, CLASS_TAG_NAME_EXECUTOR} from '../HasTagClassNameInterface'

/**
 * @interface ExecutorInterface
 */
export class ExecutorInterface {
  constructor() {
    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_EXECUTOR
    })
  }

  process(job) {
    throw Error('ExecutorRequesterInterface:process should be override')
  }
}
