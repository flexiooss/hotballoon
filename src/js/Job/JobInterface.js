import {CLASS_TAG_NAME, CLASS_TAG_NAME_JOB} from '../HasTagClassNameInterface'

/**
 * @interface
 */
export class JobInterface {
  constructor() {
    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_JOB
    })
  }

  processInline() {
    throw Error('JobInterface:processInline should be override')
  }

  processWorker() {
    throw Error('JobInterface:processWorker should be override')
  }

  finish() {
    throw Error('JobInterface:finish should be override')
  }
}
