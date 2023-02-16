import {ExecutorInterface} from './ExecutorInterface.js'
import {TypeCheck} from '../Types/TypeCheck.js'
import {assertType} from '@flexio-oss/js-commons-bundle/assert/index.js'

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
