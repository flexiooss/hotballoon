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
    /**
     * @type {DOMTokenList|Array<string>}
     */
    const candidateClassList = this._candidate.classList
    /**
     * @type {DOMTokenList|Array<string>}
     */
    const currentClassList = this._current.classList

    /**
     * @type {Array<string>}
     */
    const add = []
    candidateClassList.forEach((value, key, list) => {
      if (!currentClassList.contains(value)) {
        add.push(value)
      }
    })
    if (add.length) {
      currentClassList.add(...add)
    }

    /**
     * @type {Array<string>}
     */
    const remove = []
    currentClassList.forEach((value, key, list) => {
      if (!candidateClassList.contains(value)) {
        remove.push(value)
      }
    })
    if (remove.length) {
      currentClassList.remove(...remove)
    }
  }
}
