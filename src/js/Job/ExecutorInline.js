import {ExecutorInterface} from './ExecutorInterface'
import {TypeCheck} from '../Types/TypeCheck'
import {assertType} from '@flexio-oss/assert'
/**
 * @implements {ExecutorInterface}
 */
export class ExecutorInline extends ExecutorInterface {
  /**
   *
   * @param {JobInterface} job
   */
  process(job) {
    assertType(TypeCheck.isJob(job), 'ExecutorWorker:process: `job` should be an instance of JobInterface')
    job.processInline()
  }
}
