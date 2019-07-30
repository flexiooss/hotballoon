import {CoreException} from '../CoreException'

/**
 * @interface
 */
export class Component {
  /**
   *
   * @return {Component}
   */
  mountView() {
    throw new CoreException(`mountView should be override`)
  }

  /**
   *
   */
  remove() {
    throw new CoreException(`mountView should be override`)
  }
}
