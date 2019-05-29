import {ExecutorInterface} from './ExecutorInterface'
import {TypeCheck} from '../TypeCheck'
import {assertType} from '@flexio-oss/assert'

export class ExecutorWorker extends ExecutorInterface {
  /**
   *
   * @param {JobInterface} job
   */
  process(job) {
    assertType(TypeCheck.isJob(job), 'ExecutorWorker:process: `job` should be an instance of JobInterface')
    job.processWorker()
  }
}
