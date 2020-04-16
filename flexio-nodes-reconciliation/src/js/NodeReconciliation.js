import {isNode, assert, isNodeText, isNull} from '@flexio-oss/js-commons-bundle/assert'
import {select as $} from './ListenerAttributeHandler'
import {ReconcileNodeProperties} from './ReconcileNodeProperties'
import {RECONCILIATION_RULES as R} from './rules'
import {ReconcilePrivateAttribute} from './ReconcilePrivateAttribute'
import {ReconcileNodeAttributes} from './ReconcileNodeAttributes'
import {ReconcileNodeClassList} from './ReconcileNodeClassList'

class NodeReconciliation {
  /**
   *
   * @param {Node} current
   * @param {ListenerAttributeHandler} $current
   * @param {Node} candidate
   * @param {ListenerAttributeHandler} $candidate
   */
  constructor(current, $current, candidate, $candidate) {
    assert(isNode(current) && isNode(candidate),
      'NodeReconciliation: `current` and  `candidate` arguments assert be Node')
    /**
     *
     * @params {Node}
     */
    this.current = current
    /**
     *
     * @params {ListenerAttributeHandler}
     */
    this.$current = $current
    /**
     *
     * @params {Node}
     */
    this.candidate = candidate
    /**
     *
     * @params {ListenerAttributeHandler}
     */
    this.$candidate = $candidate
  }

  /**
   *
   * @param {Node} current
   * @param {ListenerAttributeHandler} $current
   * @param {Node} candidate
   * @param {ListenerAttributeHandler} $candidate
   */
  static nodeReconciliation(current, $current, candidate, $candidate) {
    return new NodeReconciliation(current, $current, candidate, $candidate).reconcile()
  }

  reconcile() {
    if (this.__hasReplaceRule()) {
      return this.__replaceWith(this.current, this.candidate)
    }
    if (isNodeText(this.candidate)) {
      return this.__updateText()
    } else if (!isNull(this.candidate.id) && !isNull(this.current.id) && this.candidate.id !== this.current.id) {
      return this.__replaceWith(this.current, this.candidate)
    } else if (this.current.tagName && this.current.tagName === this.candidate.tagName) {

      // if (this.candidate.id !== this.current.id) {
      //   this.current.id = this.candidate.id
      // }
      ReconcileNodeClassList.create(this.$current, this.$candidate).process()
      ReconcileNodeAttributes.create(this.$current, this.$candidate).process()
      ReconcileNodeProperties.create(this.$current, this.$candidate).process()
      ReconcilePrivateAttribute.create(this.$current, this.$candidate).process()
    } else {
      return this.__replaceWith(this.current, this.candidate)
    }
    return false
  }

  /**
   *
   * @param {Node} current
   * @param {Node} candidate
   * @return {boolean}
   * @private
   */
  __replaceWith(current, candidate) {
    $(current).cleanListeners()
    current.replaceWith(candidate)
    return true
  }

  /**
   *
   * @return {boolean}
   * @private
   */
  __updateText() {
    if (isNodeText(this.current) && (this.candidate.nodeValue !== this.current.nodeValue)) {
      this.current.nodeValue = this.candidate.nodeValue
    } else {
      return this.__replaceWith(this.current, this.candidate)
    }
    return false
  }

  /**
   *
   * @return {boolean}
   * @private
   */
  __hasReplaceRule() {
    return this.$candidate.hasReconciliationRule(R.REPLACE)
  }
}

export const nodeReconcile = NodeReconciliation.nodeReconciliation
