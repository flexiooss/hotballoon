/**
 * @interface
 */
export class ReconcileNodeInterface {
  process() {
    throw Error('ReconcileNodeInterface:process should be override')
  }

  /**
   *
   * @param {ListenerAttributeHandler} $current
   * @param {ListenerAttributeHandler} $candidate
   * @return {ReconcileNodeInterface}
   */
  static create($current, $candidate) {
    throw Error(`static ReconcileNodeInterface:create should be override with this signature
    /**
   *
   * @param {ListenerAttributeHandler} $current
   * @param {ListenerAttributeHandler} $candidate
   * @return {ReconcileNodeInterface}
   */
    `)
  }
}
