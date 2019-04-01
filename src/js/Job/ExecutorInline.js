import {ExecutorInterface} from './ExecutorInterface'

/**
 * @implements {ExecutorInterface}
 */
export class ExecutorInline extends ExecutorInterface {
  /**
   *
   * @param {JobInterface} job
   */
  process(job) {
    job.processInline()
  }
}
