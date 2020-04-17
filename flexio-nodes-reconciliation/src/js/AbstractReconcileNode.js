import {ReconcileNodeInterface} from './ReconcileNodeInterface'

/**
 * @abstract
 * @implements ReconcileNodeInterface
 * @extends ReconcileNodeInterface
 */
export class AbstractReconcileNode extends ReconcileNodeInterface {
  /**
   *
   * @param {ListenerAttributeHandler} $current
   * @param {ListenerAttributeHandler} $candidate
   */
  constructor($current, $candidate) {
    super()

    /**
     *
     * @params {ListenerAttributeHandler}
     * @protected
     */
    this._$current = $current

    /**
     *
     * @params {ListenerAttributeHandler}
     * @protected
     */
    this._$candidate = $candidate
  }

  /**
   *
   * @param {ListenerAttributeHandler} $current
   * @param {ListenerAttributeHandler} $candidate
   * @return {ReconcileNodeInterface}
   */
  static create($current, $candidate) {
    return new this($current, $candidate)
  }

  /**
   * @protected
   * @return {Node}
   */
  get _candidate() {
    return this._$candidate.element
  }

  /**
   * @protected
   * @return {Node}
   */
  get _current() {
    return this._$current.element
  }
}
