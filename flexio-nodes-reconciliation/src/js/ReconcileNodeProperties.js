import {AbstractReconcileNode} from './AbstractReconcileNode'

/**
 * @implements ReconcileNodeInterface
 * @extends AbstractReconcileNode
 */
export class ReconcileNodeProperties extends AbstractReconcileNode {
  /**
   *
   * @param {Node} current
   * @param {ListenerAttributeHandler} $current
   * @param {Node} candidate
   * @param {ListenerAttributeHandler} $candidate
   */
  constructor(current, $current, candidate, $candidate) {
    super(current, $current, candidate, $candidate)

    /**
     *
     * @params {Array<string>}
     * @private
     */
    this.__currentReconcileProperties = null

    /**
     *
     * @params {Array<string>}
     * @private
     */
    this.__candidateReconcileProperties = null
  }

  /**
   * @override
   */
  process() {
    if (!this._$candidate.hasReconciliationProperties() && !this._$current.hasReconciliationProperties()) {
      return
    }

    this.__updateCurrent()
    this.__deleteUnusedProperties()
  }

  /**
   *
   * @return {Array<string>}
   * @private
   */
  __getCurrentReconcileProperties() {
    if (this.__currentReconcileProperties === null) {
      this.__currentReconcileProperties = this._$current.reconcileProperties()
    }
    return this.__currentReconcileProperties
  }

  /**
   *
   * @return {Array<string>}
   * @private
   */
  __getCandidateReconcileProperties() {
    if (this.__candidateReconcileProperties === null) {
      this.__candidateReconcileProperties = this._$candidate.reconcileProperties()
    }
    return this.__candidateReconcileProperties
  }

  /**
   *
   * @private
   */
  __updateCurrent() {
    for (const property of this.__getCandidateReconcileProperties()) {
      this._current[property] = this._candidate[property]
    }
  }

  /**
   *
   * @private
   */
  __deleteUnusedProperties() {
    for (const property of this.__getCurrentReconcileProperties()) {
      if (!this._$candidate.hasReconciliationProperty(property) && !(property in this._candidate)) {
        delete this._current[property]
      }
    }
  }
}
