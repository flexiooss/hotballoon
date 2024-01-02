import {AbstractReconcileNode} from './AbstractReconcileNode'
import {isNull} from "@flexio-oss/js-commons-bundle/assert/index.js";

/**
 * @implements ReconcileNodeInterface
 * @extends AbstractReconcileNode
 */
export class ReconcileNodeProperties extends AbstractReconcileNode {
    /**
     * @params {?Set<string>}
     */
    #currentReconcileProperties = null
    /**
     * @params {?Set<string>}
     */
    #candidateReconcileProperties = null

  /**
   * @override
   */
  process() {
    if (!this._$candidate.hasReconciliationProperties() && !this._$current.hasReconciliationProperties())       return

    this
      .#updateCurrent()
      .#deleteUnusedProperties()
  }

  /**
   * @return {Set<string>}
   */
  #getCurrentReconcileProperties() {
    if (isNull(this.#currentReconcileProperties )) {
      this.#currentReconcileProperties = this._$current.reconcileProperties()
    }
    return this.#currentReconcileProperties
  }

  /**
   * @return {Set<string>}
   */
  #getCandidateReconcileProperties() {
    if (isNull(this.#candidateReconcileProperties )) {
      this.#candidateReconcileProperties = this._$candidate.reconcileProperties()
    }
    return this.#candidateReconcileProperties
  }

  /**
   * @return {this}
   */
  #updateCurrent() {
    for (const property of this.#getCandidateReconcileProperties()) {
      this._current[property] = this._candidate[property]
    }

    return this
  }

  /**
   * @return {this}
   */
  #deleteUnusedProperties() {
    for (const property of this.#getCurrentReconcileProperties()) {
      if (!this._$candidate.hasReconciliationProperty(property) && !(property in this._candidate)) {
        delete this._current[property]
      }
    }
    return this
  }
}
