import {AbstractReconcileNode} from './AbstractReconcileNode'

/**
 * @implements ReconcileNodeInterface
 * @extends AbstractReconcileNode
 */
export class ReconcilePrivateAttribute extends AbstractReconcileNode {
  /**
   * @override
   */
  process() {
    this._$current.replaceAttributes(this._$candidate.getAttributes())
  }
}
