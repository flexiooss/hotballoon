import {AbstractReconcileNode} from './AbstractReconcileNode'

const EXCLUDES_ATTRIBUTES = ['class', 'id']

/**
 * @implements ReconcileNodeInterface
 * @extends AbstractReconcileNode
 */
export class ReconcileNodeAttributes extends AbstractReconcileNode {
  /**
   * @override
   */
  process() {
    const candidateAttrs = this._candidate.attributes
    if (candidateAttrs) {
      for (let i = candidateAttrs.length - 1; i >= 0; i--) {
        if (EXCLUDES_ATTRIBUTES.indexOf(candidateAttrs[i].name) === -1) {
          if (this._current.getAttribute(candidateAttrs[i].name) !== candidateAttrs[i].value) {
            this._current.setAttribute(candidateAttrs[i].name, candidateAttrs[i].value)
          }
        }
      }
    }

    const currentAttrs = this._current.attributes
    if (currentAttrs) {
      for (let i = currentAttrs.length - 1; i >= 0; i--) {
        if (!this._candidate.hasAttribute(currentAttrs[i].name)) {
          this._current.removeAttribute(currentAttrs[i].name)
        }
      }
    }
  }
}
