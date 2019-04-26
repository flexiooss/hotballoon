import {Reconciliation} from 'flexio-nodes-reconciliation'
import {select} from './HotBalloonAttributeHandler'

class HotballoonElementReconciliation extends Reconciliation {
  /**
   * @static
   * @param {Element} current
   * @param {Element} candidate
   * @param {Element} parentCurrent Parent of current element
   */
  static reconciliation(current, candidate, parentCurrent) {
    new HotballoonElementReconciliation(current, candidate, parentCurrent).reconcile()
  }

  /**
   * @static
   * @param {Element} current
   * @param {Element} candidate
   * @param {Element} parentCurrent Parent of current element
   */
  static startReconciliation(current, candidate, parentCurrent) {
    new Reconciliation(current, candidate, parentCurrent)
      .withRootReconciliation(true)
      .reconcile()
  }

  /**
   * @override
   * @param {Element} element
   * @return {AttributeHandler}
   */
  castAttributes(element) {
    return select(element)
  }

  /**
   * @override
   * @return {(boolean | void)}
   */
  reconcile() {
    if (this.__isSubView() && !this._hasForceRule()) {
      return this._abort()
    }
    super.reconcile()
  }

  /**
   *
   * @return {boolean}
   * @private
   */
  __isSubView() {
    return !this.isRootElementReconcile() && this.$candidate.hasViewRef()
  }
}

export const reconcile = HotballoonElementReconciliation.reconciliation
export const startReconcile = Reconciliation.startReconciliation
