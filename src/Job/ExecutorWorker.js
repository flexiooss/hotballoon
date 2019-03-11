import {ExecutorInterface} from './ExecutorInterface'

export class ExecutorWorker extends ExecutorInterface {
  /**
   *
   * @param {JobInterface} job
   */
  process(job) {
    job.processWorker()
  }
}
