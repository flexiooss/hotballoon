import {AbstractReconcileNode} from './AbstractReconcileNode'

/**
 * @implements ReconcileNodeInterface
 * @extends AbstractReconcileNode
 */
export class ReconcileNodeClassList extends AbstractReconcileNode {
  /**
   * @override
   */
  process() {
    const candidateClassList = this._candidate.classList
    const currentClassList = this._current.classList
    if (candidateClassList && candidateClassList.length) {
      candidateClassList.forEach((value, key, list) => {
        if (!currentClassList.contains(value)) {
          currentClassList.add(value)
        }
      })
    }
    if (candidateClassList && candidateClassList.length) {
      currentClassList.forEach((value, key, list) => {
        if (((currentClassList && currentClassList.length) && !candidateClassList.contains(value))) {
          currentClassList.remove(value)
        }
      })
    }
  }
}
