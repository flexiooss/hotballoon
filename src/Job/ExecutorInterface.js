/**
 * @interface ExecutorInterface
 */
export class ExecutorInterface {
  process(job) {
    throw Error('ExecutorInterface:process should be override')
  }
}
