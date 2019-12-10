import {Reconciliation, RECONCILIATION_RULES as R} from '@flexio-oss/flexio-nodes-reconciliation'
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
    new HotballoonElementReconciliation(current, candidate, parentCurrent)
      .withRootReconciliation(true)
      .reconcile()
  }

  /**
   * @param {Element} current
   * @param {Element} candidate
   * @param {Element} parentCurrent Parent of current element
   */
  reconciliation(current, candidate, parentCurrent) {
    HotballoonElementReconciliation.reconciliation(current, candidate, parentCurrent)
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
    if (this.__isSubView() && !this._hasForceRule() && !this.$parentCurrent.hasReconciliationRule(R.FORCE)) {
      return this._abort()
    }
    return super.reconcile()
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
export const startReconcile = HotballoonElementReconciliation.startReconciliation
