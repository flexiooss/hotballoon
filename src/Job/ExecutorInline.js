import {ExecutorInterface} from './ExecutorInterface'

export class ExecutorInline extends ExecutorInterface {
  /**
   *
   * @param {JobInterface} job
   */
  process(job) {
    job.processInline()
  }
}
